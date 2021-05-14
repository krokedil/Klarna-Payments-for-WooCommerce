import puppeteer from "puppeteer";
import kpURLS from "../helpers/kpURLS";
import kpFrame from "../helpers/kpFrame";
import kpUtils from "../helpers/kpUtils";
import cart from "../helpers/kpCart";

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
	cardNumber,
	pinNumber,

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

// Main selectors
let page;
let browser;
let context;

/**
 * TEST ELEMENTS SELECTORS
 * Input variables that are to be applied for the test
 */

// User logged-in (true) / Guest (false)
const isUserLoggedIn = true;

// Products selection
const productsToCart = [
	simpleProduct25,
	variableProduct25Blue,
	variableProduct25Green,
];

// Shipping method selection
const shippingMethod = freeShippingMethod;

// Private individual ("person") / Organization or Company ("company")
const customerType = "company";

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
	}, 250000);

	// Close Chromium on test end (will close on both success and fail)
	afterAll(() => {
		if (!page.isClosed()) {
			browser.close();
			context.close();
		}
	}, 900000);

	/**
	 * Begin test suite
	 */
	test("second flow should be on the my account page", async () => {

		await page.goto("http://localhost:8000/shop/?add-to-cart=1547");
		await page.waitForTimeout(2 * timeOutTime);
		// await page.goto("http://localhost:8000/checkout");

		await page.goto(kpURLS.CHECKOUT)

		if(selectedPaymentMethod==="pay_later"){

			// Pay Later Method
			await kpUtils.selectOptionTab(page,'label[for="payment_method_klarna_payments_pay_later"]', true)
			await page.waitForTimeout(timeOutTime);

			// Billing form
			await kpFrame.submitBillingForm(page, billingData);
			await page.waitForTimeout(4 * timeOutTime);

			const framePayLater = await kpFrame.loadIFrame(
				page,
				"klarna-pay-later-main"
			);

			await kpUtils.selectOptionTab(framePayLater,'label[for="installments-invoice|-1"]', true);

			await kpUtils.selectOptionTab(page,'input[type="checkbox"][name="terms"][id="terms"]', false);

			await page.waitForTimeout(timeOutTime);

			await kpUtils.selectOptionTab(page,'button[type="submit"][name="woocommerce_checkout_place_order"][id="place_order"]', false);

			await page.waitForTimeout(4 * timeOutTime)

			// PIN number
			const framePayLaterFullScreen = await kpFrame.loadIFrame(
				page,
				"klarna-pay-later-fullscreen"
			);

			await kpUtils.selectOptionTab(framePayLaterFullScreen,'input[name="nationalIdentificationNumber"]', true)

			await framePayLaterFullScreen.type('input[name="nationalIdentificationNumber"]', pinNumber);

			await kpUtils.selectOptionTab(framePayLaterFullScreen,'button[id="purchase-approval-form-continue-button"]', false)

			await page.waitForTimeout(10 * timeOutTime)

		} else if (selectedPaymentMethod === 'credit'){

			// Card Payment method
			await kpUtils.selectOptionTab(page,'label[for="payment_method_klarna_payments_pay_now"]', true)

			await page.waitForTimeout(timeOutTime);

			// Billing form
			await kpFrame.submitBillingForm(page, billingData);
			
			await page.waitForTimeout(4 * timeOutTime);

			const framePayCard = await kpFrame.loadIFrame(
				page,
				"payment-gateway-frame"
			);

			// Fill out credit form
			await kpUtils.selectOptionTab(framePayCard,'input[id="cardNumber"]', true)

			await framePayCard.type('input[id="cardNumber"]', cardNumber);
			await framePayCard.type('input[id="expire"]', "1130");
			await framePayCard.type('input[id="securityCode"]', "123");

			await kpUtils.selectOptionTab(page,'input[type="checkbox"][name="terms"][id="terms"]', false)

			await page.waitForTimeout(timeOutTime);

			await kpUtils.selectOptionTab(page,'button[type="submit"][name="woocommerce_checkout_place_order"][id="place_order"]', false)
		}

		await page.waitForTimeout(8 * timeOutTime);

		const h1 = await page.$eval("h1", (e) => e.textContent);
		expect(h1).toBe("Order received");
	}, 190000);
});
