import puppeteer from "puppeteer";
import kpURLS from "../helpers/kpURLS";
import kpFrame from "../helpers/kpFrame";
import kpUtils from "../helpers/kpUtils";
import cart from "../helpers/kpCart";
import { wooValues, klarnaValues } from "../helpers/kpCompRes";

import {
	puppeteerOptions as options,
	customerAPIData,
	klarnaOrderEndpoint,

	/**
	 * General data
	 */
	billingData,
	userCredentials,
	timeOutTime,
	expireDate,
	cardNumber,
	cardSecurityCode,
	pinNumber,
	companyNumber,

	/**
	 * Shipping methods
	 */
	freeShippingMethod,
	freeShippingMethodTarget,
	flatRateMethod,
	flatRateMethodTarget,

	/**
	 * Payment methods
	 */
	creditPaymentMethod,
	payLaterPaymentMethod,

	/**
	 * Coupons
	 */
	couponFixedCart,
	couponFixedProduct,
	couponPercent,
	couponTotalFreeShipping,
	couponTotalWithShipping,

	/**
	 * Products
	 */
	simpleProduct25,
	simpleProduct12,
	simpleProduct6,
	simpleProduct0,
	simpleProductSale25,
	simpleProductSale12,
	simpleProductSale6,
	simpleProductSale0,
	variableProduct25Black,
	variableProduct25Blue,
	variableProduct25Brown,
	variableProduct25Green,
	variableProductMixedBlackS,
	variableProductMixedBlackM,
	variableProductMixedBlackL,
	variableProductMixedBlackXL,
	variableProductMixedGreenS,
	variableProductMixedGreenM,
	variableProductMixedGreenL,
	variableProductMixedGreenXL,
	variableProductVirtualDownloadable25,
} from "../config/config";

import API from "../api/API";
import woocommerce from "../api/woocommerce";

const cll = (x) => {
	console.log(x);
};

// Main selectors
let page;
let browser;
let context;
const productCounterArray = [];

/**
 * TEST ELEMENTS SELECTORS
 * Input variables that are to be applied for the test
 */

// User Logged-in (true) / Guest (false)
const isUserLoggedIn = true;

// Products selection
const productsToCart = [
	simpleProduct25,
	variableProduct25Blue,
	variableProduct25Green,
];

kpUtils.createHelperArray(productsToCart, productCounterArray);

// Shipping method selection
const shippingMethod = freeShippingMethod;

// rivate individual ("b2b") / Organization or Company ("b2c")
const customerType = "b2c";

// Payment method selection
const selectedPaymentMethod = creditPaymentMethod;

// Coupon selection
const appliedCoupons = [couponPercent];

/**
 * TEST INITIALIZATION
 */
describe("KP", () => {
	beforeAll(async () => {
		browser = await puppeteer.launch(options);
		context = await browser.createIncognitoBrowserContext();
		page = await context.newPage();
		try {
			const customerResponse = await API.getWCCustomers();
			const { data } = customerResponse;
			if (parseInt(data.length, 10) < 1) {
				try {
					await API.createWCCustomer(customerAPIData);
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) {
			console.log(error);
		}

		await kpUtils.toggleCustomerType(customerType);
	}, 250000);

	// Close Chromium on test end (will close on both success and fail)
	afterAll(() => {
		if (!page.isClosed()) {
			browser.close();
			// context.close();
		}
	}, 900000);

	/**
	 * Begin test suite
	 */
	test("second flow should be on the my account page", async () => {
		await page.waitForTimeout(timeOutTime);
		await cart.addMultipleProductsToCart(page, productsToCart);
		await page.waitForTimeout(timeOutTime);

		await page.goto(kpURLS.CHECKOUT);

		if (selectedPaymentMethod === "pay_later") {
			// Pay Later Method
			await kpUtils.selectOptionTab(
				page,
				'label[for="payment_method_klarna_payments_pay_later"]',
				true
			);
			await page.waitForTimeout(timeOutTime);

			// Billing form
			await kpFrame.submitBillingForm(page, billingData);
			await page.waitForTimeout(4 * timeOutTime);

			const framePayLater = await kpFrame.loadIFrame(
				page,
				"klarna-pay-later-main"
			);

			if (customerType === "b2c") {
				await kpUtils.selectOptionTab(
					framePayLater,
					'label[for="installments-invoice|-1"]',
					true
				);
			}

			await kpUtils.selectOptionTab(
				page,
				'input[type="checkbox"][name="terms"][id="terms"]',
				false
			);

			await page.waitForTimeout(timeOutTime);

			await kpUtils.selectOptionTab(
				page,
				'button[type="submit"][name="woocommerce_checkout_place_order"][id="place_order"]',
				false
			);

			await page.waitForTimeout(4 * timeOutTime);

			await page.waitForTimeout(0.5 * timeOutTime);

			// PIN number
			const framePayLaterFullScreen = await kpFrame.loadIFrame(
				page,
				"klarna-pay-later-fullscreen"
			);

			console.log(pinNumber);
			console.log(companyNumber);
			await page.waitForTimeout(0.5 * timeOutTime);
			if (customerType === "b2c") {
				kpUtils.fillOptionTab(
					framePayLaterFullScreen,
					'input[name="nationalIdentificationNumber"]',
					'button[id="purchase-approval-form-continue-button"]',
					pinNumber
				);
			} else if (customerType === "b2b") {
				kpUtils.fillOptionTab(
					framePayLaterFullScreen,
					'input[name="organizationNumber"]',
					'button[id="organizationalData-dataCollection__submit"]',
					companyNumber
				);
			}

			await page.waitForTimeout(10 * timeOutTime);
		} else if (selectedPaymentMethod === "credit") {
			// Card Payment method
			await kpUtils.selectOptionTab(
				page,
				'label[for="payment_method_klarna_payments_pay_now"]',
				true
			);
			await page.waitForTimeout(timeOutTime);

			// Billing form
			await kpFrame.submitBillingForm(page, billingData);
			await page.waitForTimeout(4 * timeOutTime);

			const framePayCard = await kpFrame.loadIFrame(
				page,
				"payment-gateway-frame"
			);

			// Fill out credit form
			await kpUtils.selectOptionTab(
				framePayCard,
				'input[id="cardNumber"]',
				true
			);

			await framePayCard.type('input[id="cardNumber"]', cardNumber);
			await framePayCard.type('input[id="expire"]', expireDate);
			await framePayCard.type('input[id="securityCode"]', cardSecurityCode);

			await kpUtils.selectOptionTab(
				page,
				'input[type="checkbox"][name="terms"][id="terms"]',
				false
			);

			await page.waitForTimeout(timeOutTime);

			await kpUtils.selectOptionTab(
				page,
				'button[type="submit"][name="woocommerce_checkout_place_order"][id="place_order"]',
				false
			);
		}

		await page.waitForTimeout(5000);

		await page.waitForTimeout(2 * timeOutTime);

		const currentURL = await page.url();

		const orderId = currentURL
			.replace("http://localhost:8000/checkout/order-received/", "")
			.slice(0, 4);

		const WooResponse = await API.getWCOrderById(orderId);

		const KPOrderId = WooResponse.data.transaction_id;
		const KPResponse = await API.getKlarnaOrderById(
			page,
			klarnaOrderEndpoint,
			KPOrderId
		);

		const klarnaOrderLinesContainer = [];
		const wooOrderLinesContainer = [];

		KPResponse.data.order_lines.forEach((klarnaOrderLinesItemType) => {
			if (klarnaOrderLinesItemType.type !== "shipping_fee") {
				klarnaOrderLinesContainer.push(klarnaOrderLinesItemType);
			}
		});

		WooResponse.data.line_items.forEach((wooOrderLinesItemType) => {
			if (wooOrderLinesItemType.type !== "shipping_fee") {
				wooOrderLinesContainer.push(wooOrderLinesItemType);
			}
		});

		for (let i = 0; i < klarnaOrderLinesContainer.length; i += 1) {
			if (
				klarnaOrderLinesContainer[i].reference ===
				wooOrderLinesContainer[i].sku
			) {
				if (
					parseFloat(klarnaOrderLinesContainer[i].total_amount) ===
					parseInt(
						Math.round(
							(parseFloat(wooOrderLinesContainer[i].total) +
								parseFloat(
									wooOrderLinesContainer[i].total_tax
								)) *
								100
						).toFixed(2),
						10
					)
				) {
					klarnaValues.totalAmount.push(
						klarnaOrderLinesContainer[i].total_amount
					);
					wooValues.totalAmount.push(
						parseInt(
							Math.round(
								(parseFloat(wooOrderLinesContainer[i].total) +
									parseFloat(
										wooOrderLinesContainer[i].total_tax
									)) *
									100
							).toFixed(2),
							10
						)
					);
				}

				if (
					klarnaOrderLinesContainer[i].quantity ===
					wooOrderLinesContainer[i].quantity
				) {
					klarnaValues.quantity.push(
						klarnaOrderLinesContainer[i].quantity
					);
					wooValues.quantity.push(wooOrderLinesContainer[i].quantity);
				}

				if (
					klarnaOrderLinesContainer[i].total_tax_amount ===
					wooOrderLinesContainer[i].total_tax * 100
				) {
					klarnaValues.totalTax.push(
						klarnaOrderLinesContainer[i].total_tax_amount
					);
					wooValues.totalTax.push(
						wooOrderLinesContainer[i].total_tax * 100
					);
				}

				if (
					klarnaOrderLinesContainer[i].name ===
					wooOrderLinesContainer[i].name
				) {
					klarnaValues.productName.push(
						klarnaOrderLinesContainer[i].name
					);
					wooValues.productName.push(wooOrderLinesContainer[i].name);
				}

				if (
					klarnaOrderLinesContainer[i].reference ===
					wooOrderLinesContainer[i].sku
				) {
					klarnaValues.sku.push(
						klarnaOrderLinesContainer[i].reference
					);
					wooValues.sku.push(wooOrderLinesContainer[i].sku);
				}
			}
		}

		if (KPResponse.data.order_id === WooResponse.data.transaction_id) {
			klarnaValues.orderId = KPResponse.data.order_id;
			wooValues.orderId = WooResponse.data.transaction_id;
		}

		if (
			KPResponse.data.shipping_address.given_name ===
			WooResponse.data.billing.first_name
		) {
			klarnaValues.firstName =
				KPResponse.data.shipping_address.given_name;
			wooValues.firstName = WooResponse.data.billing.first_name;
		}

		if (
			KPResponse.data.shipping_address.family_name ===
			WooResponse.data.billing.last_name
		) {
			klarnaValues.lastName =
				KPResponse.data.shipping_address.family_name;
			wooValues.lastName = WooResponse.data.billing.last_name;
		}

		if (
			KPResponse.data.shipping_address.street_address ===
			WooResponse.data.billing.address_1
		) {
			klarnaValues.addressOne =
				KPResponse.data.shipping_address.street_address;
			wooValues.addressOne = WooResponse.data.billing.address_1;
		}

		if (
			KPResponse.data.shipping_address.street_address2 ===
			WooResponse.data.billing.address_2
		) {
			klarnaValues.addressTwo =
				KPResponse.data.shipping_address.street_address2;
			wooValues.addressTwo = WooResponse.data.billing.address_2;
		}

		if (
			KPResponse.data.shipping_address.city ===
			WooResponse.data.billing.city
		) {
			klarnaValues.city = KPResponse.data.shipping_address.city;
			wooValues.city = WooResponse.data.billing.city;
		}

		if (
			KPResponse.data.shipping_address.region ===
			WooResponse.data.billing.state
		) {
			klarnaValues.region = KPResponse.data.shipping_address.region;
			wooValues.region = WooResponse.data.billing.state;
		}

		if (
			KPResponse.data.shipping_address.postal_code.replace(/\s/g, "") ===
			WooResponse.data.billing.postcode
		) {
			klarnaValues.postcode = KPResponse.data.shipping_address.postal_code.replace(
				/\s/g,
				""
			);
			wooValues.postcode = WooResponse.data.billing.postcode;
		}

		if (
			KPResponse.data.shipping_address.country ===
			WooResponse.data.billing.country
		) {
			klarnaValues.country = KPResponse.data.shipping_address.country;
			wooValues.country = WooResponse.data.billing.country;
		}

		if (
			KPResponse.data.shipping_address.email ===
			WooResponse.data.billing.email
		) {
			klarnaValues.email = KPResponse.data.shipping_address.email;
			wooValues.email = WooResponse.data.billing.email;
		}

		if (KPResponse.data.purchase_currency === WooResponse.data.currency) {
			klarnaValues.currency = KPResponse.data.purchase_currency;
			wooValues.currency = WooResponse.data.currency;
		}

		if (
			KPResponse.data.order_lines[productCounterArray.length].name ===
			WooResponse.data.shipping_lines[0].method_title
		) {
			klarnaValues.shippingMethod =
				KPResponse.data.order_lines[productCounterArray.length].name;
			wooValues.shippingMethod =
				WooResponse.data.shipping_lines[0].method_title;
		}

		if (
			KPResponse.data.shipping_address.phone ===
			WooResponse.data.billing.phone
		) {
			klarnaValues.phone = KPResponse.data.shipping_address.phone;
			wooValues.phone = WooResponse.data.billing.phone;
		}

		await page.waitForTimeout(10 * timeOutTime);

		const h1 = await page.$eval("h1", (e) => e.textContent);
		expect(h1).toBe("Order received");
	}, 190000);

	test("Compare IDs", async () => {
		expect(toString(klarnaValues.orderId)).toBe(
			toString(wooValues.orderId)
		);
	}, 190000);

	test("Compare names", async () => {
		expect(klarnaValues.firstName).toBe(wooValues.firstName);
	}, 190000);

	test("Compare last names", async () => {
		expect(klarnaValues.lastName).toBe(wooValues.lastName);
	}, 190000);

	test("Compare cities", async () => {
		expect(klarnaValues.city).toBe(wooValues.city);
	}, 190000);

	test("Compare regions", async () => {
		expect(klarnaValues.region).toBe(wooValues.region);
	}, 190000);

	test("Compare countries", async () => {
		expect(klarnaValues.country).toBe(wooValues.country);
	}, 190000);

	test("Compare post codes", async () => {
		expect(klarnaValues.postcode).toBe(wooValues.postcode);
	}, 190000);

	test("Compare first address", async () => {
		expect(klarnaValues.addressOne).toBe(wooValues.addressOne);
	}, 190000);

	test("Compare second address", async () => {
		expect(klarnaValues.addressTwo).toBe(wooValues.addressTwo);
	}, 190000);

	test("Compare emails", async () => {
		expect(klarnaValues.email).toBe(wooValues.email);
	}, 190000);

	test("Compare SKU-s", async () => {
		expect(toString(klarnaValues.sku)).toBe(toString(wooValues.sku));
	}, 190000);

	test("Compare total amounts", async () => {
		expect(toString(klarnaValues.totalAmount)).toBe(
			toString(wooValues.totalAmount)
		);
	}, 190000);

	test("Compare total taxes", async () => {
		expect(toString(klarnaValues.totalTax)).toBe(
			toString(wooValues.totalTax)
		);
	}, 190000);

	test("Compare product names", async () => {
		expect(toString(klarnaValues.productName)).toBe(
			toString(wooValues.productName)
		);
	}, 190000);

	test("Compare Shipping methods", async () => {
		expect(toString(klarnaValues.shippingMethod)).toBe(
			toString(wooValues.shippingMethod)
		);
	}, 190000);

	test("Compare Quantities", async () => {
		expect(toString(klarnaValues.quantity)).toBe(
			toString(wooValues.quantity)
		);
	}, 190000);

	test("Compare currencies", async () => {
		expect(klarnaValues.currency).toBe(wooValues.currency);
	}, 190000);

	test("Compare telephones", async () => {
		expect(klarnaValues.phone).toBe(wooValues.phone);
	}, 190000);
});
