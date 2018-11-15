<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
/**
 * Handles subscription payments with Klarna Payments.
 */
class WC_Klarna_Payments_Subscriptions {
	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'woocommerce_scheduled_subscription_payment_klarna_payments', array( $this, 'trigger_scheduled_payment' ), 10, 2 );
		add_action( 'kp_wc_process_payment_before_redirect', array( $this, 'add_customer_token' ), 10, 2 );
		add_action( 'woocommerce_admin_order_data_after_billing_address', array( $this, 'show_customer_token' ) );
		add_action( 'woocommerce_process_shop_order_meta', array( $this, 'save_customer_token_update' ), 45, 2 );
	}

	/**
	 * Triggers scheduled payment
	 */
	public function trigger_scheduled_payment( $renewal_total, $renewal_order ) {
		$order_id = $renewal_order->get_id();

		$subscriptions = wcs_get_subscriptions_for_renewal_order( $renewal_order->get_id() );
		reset( $subscriptions );
		$subscription_id = key( $subscriptions );
		$customer_token  = get_post_meta( $order_id, '_kp_customer_token', true );

		if ( empty( $customer_token ) ) {
			$customer_token = get_post_meta( WC_Subscriptions_Renewal_Order::get_parent_order_id( $order_id ), '_kp_customer_token', true );
			update_post_meta( $order_id, '_kp_customer_token', $recurring_token );
		}

		$klarna_country      = $renewal_order->get_billing_country();
		$create_klarna_order = new WC_Gateway_Klarna_Payments( $klarna_country );
		$response            = $create_klarna_order->create_recurring_order( $renewal_order, $customer_token );
		if ( isset( $response['order_id'] ) ) {
			WC_Subscriptions_Manager::process_subscription_payments_on_order( $renewal_order );
			$renewal_order->add_order_note( sprintf( __( 'Subscription payment made with Klarna. Klarna order id: %s', 'klarna-checkout-for-woocommerce' ), $response['order_id'] ) );
			$renewal_order->payment_complete();
		} else {
			WC_Subscriptions_Manager::process_subscription_payment_failure_on_order( $renewal_order );
			$renewal_order->add_order_note( sprintf( __( 'Subscription payment failed with Klarna. Error code: %1$s. Message: %2$s', 'klarna-checkout-for-woocommerce' ), $create_order_response['response']['code'], $create_order_response['response']['message'] ) );
		}
	}

	/**
	 * Checks the order if it has a subscription product in it.
	 *
	 * @return bool
	 */
	public function check_if_subscription( $order_id ) {
		if ( class_exists( 'WC_Subscriptions_Order' ) && wcs_order_contains_subscription( $order_id ) ) {
			return true;
		}
		return false;
	}

	public function add_customer_token( $order_id, $auth_token ) {
		if ( $this->check_if_subscription( $order_id ) ) {
			if ( did_action( 'kp_wc_process_payment_before_redirect' ) <= 1 ) {
				$order_data     = new WC_Gateway_Klarna_Payments();
				$order_data     = $order_data->get_klarna_session();
				$customer_token = $this->create_customer_token( $order_data, $auth_token );

				$this->set_customer_token_for_order( $order_id, $customer_token );
			}
		}
	}

	/**
	 * Create customer token.
	 *
	 * @param array  $customer_data Customer data from Klarna
	 * @param string $auth_token The Klarna auth token
	 * @return void
	 */
	public function create_customer_token( $customer_data, $auth_token ) {
		$body = array(
			'purchase_country'  => $customer_data['purchase_country'],
			'purchase_currency' => $customer_data['purchase_currency'],
			'locale'            => $customer_data['locale'],
			'billing_address'   => $customer_data['billing_address'],
			'customer'          => $customer_data['customer'],
			'description'       => 'Subscription purchase',
			'intended_use'      => 'SUBSCRIPTION',
		);

		$make_request   = new WC_Gateway_Klarna_Payments();
		$customer_token = $make_request->create_customer_token_request( $body, $auth_token );

		return $customer_token['token_id'];
	}

	/**
	 * Sets the recurring token for the subscription order
	 *
	 * @return void
	 */
	public function set_customer_token_for_order( $order_id = null, $customer_token ) {
		$wc_order = wc_get_order( $order_id );
		if ( $this->check_if_subscription( $order_id ) ) {
			$subcriptions        = wcs_get_subscriptions_for_order( $order_id );
				$recurring_token = $klarna_order->recurring_token;
			foreach ( $subcriptions as $subcription ) {
				update_post_meta( $subcription->get_id(), '_kp_customer_token', $customer_token );
			}
				update_post_meta( $order_id, '_kp_customer_token', $customer_token );
		}
	}

	public function show_customer_token( $order ) {
		if ( 'shop_subscription' === $order->get_type() && get_post_meta( $order->get_id(), '_kp_customer_token' ) ) {
			?>
			<div class="order_data_column" style="clear:both; float:none; width:100%;">
				<div class="address">
					<?php
						echo '<p><strong>' . __( 'Klarna customer token' ) . ':</strong>' . get_post_meta( $order->id, '_kp_customer_token', true ) . '</p>';
					?>
				</div>
				<div class="edit_address">
					<?php
						woocommerce_wp_text_input(
							array(
								'id'            => '_kp_customer_token',
								'label'         => __( 'Klarna customer token' ),
								'wrapper_class' => '_billing_company_field',
							)
						);
					?>
				</div>
			</div>
		<?php
		}
	}

	public function save_customer_token_update( $post_id, $post ) {
		$order = wc_get_order( $post_id );
		if ( 'shop_subscription' === $order->get_type() && get_post_meta( $post_id, '_kp_customer_token' ) ) {
			update_post_meta( $post_id, '_kp_customer_token', wc_clean( $_POST['_kp_customer_token'] ) );
		}
	}
}
new WC_Klarna_Payments_Subscriptions();
