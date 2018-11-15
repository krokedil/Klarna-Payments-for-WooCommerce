<?php

class Klarna_Payments_Order_Lines_Order {
	/**
	 * Formatted order lines.
	 *
	 * @var $order_lines
	 */
	private $order_lines = array();

	private $order = array();

	public function __construct( $order ) {
		$this->order = $order;
	}

	/**
	 * Gets formatted order lines from WooCommerce cart.
	 *
	 * @return array
	 */
	public function order_lines() {
		$this->process_order();
		$this->process_shipping();
		$this->process_fees();

		return array(
			'order_lines'       => $this->order_lines,
			'order_amount'      => $this->order->get_total() * 100,
			'order_tax_amount'  => $this->order->get_total_tax() * 100,
			'purchase_currency' => $this->order->get_currency(),
		);
	}

	public function process_order() {
		foreach ( $this->order->get_items() as $item ) {
			$order_line = array(
				'reference'             => $item->get_product_id(),
				'name'                  => $item->get_name(),
				'quantity'              => $item->get_quantity(),
				'unit_price'            => intval( ( $item->get_total() + $item->get_total_tax() ) / $item->get_quantity() * 100 ),
				'tax_rate'              => $this->get_order_line_tax_rate( $this->order ),
				'total_amount'          => intval( ( $item->get_total() + $item->get_total_tax() ) * 100 ),
				'total_tax_amount'      => intval( $item->get_total_tax() * 100 ),
				'total_discount_amount' => 0,
			);

			$this->order_lines[] = $order_line;
		}
	}

	public function process_shipping() {
		$shipping            = array(
			'type'             => 'shipping_fee',
			'reference'        => 'Shipping',
			'name'             => $this->order->get_shipping_method(),
			'quantity'         => 1,
			'unit_price'       => intval( ( $this->order->get_shipping_total() + $this->order->get_shipping_tax() ) * 100 ),
			'tax_rate'         => ( '0' !== $this->order->get_shipping_tax() ) ? $this->get_order_line_tax_rate( $this->order ) : 0,
			'total_amount'     => intval( ( $this->order->get_shipping_total() + $this->order->get_shipping_tax() ) * 100 ),
			'total_tax_amount' => intval( $this->order->get_shipping_tax() * 100 ),
		);
		$this->order_lines[] = $shipping;
	}

	public function process_fees() {
		foreach ( $this->order->get_fees() as $fee ) {
			$order_fee           = array(
				'reference'             => $fee->get_sku(),
				'name'                  => $fee->get_name(),
				'quantity'              => $fee->get_quantity(),
				'unit_price'            => intval( ( $fee->get_total() + $fee->get_total_tax() ) / $fee->get_quantity() * 100 ),
				'tax_rate'              => ( '0' !== $this->order->get_total_tax() ) ? $this->get_order_line_tax_rate( $this->order ) : 0,
				'total_amount'          => intval( ( $fee->get_total() + $fee->get_total_tax() ) * 100 ),
				'total_tax_amount'      => intval( $fee->get_total_tax() * 100 ),
				'total_discount_amount' => 0,
			);
			$this->order_lines[] = $order_fee;
		}
	}

	public function get_order_line_tax_rate( $order ) {
		$tax_items = $order->get_items( 'tax' );
		foreach ( $tax_items as $tax_item ) {
			$rate_id = $tax_item->get_rate_id();
			return intval( WC_Tax::_get_tax_rate( $rate_id )['tax_rate'] * 100 );
		}
	}
}
