import puppeteer from "puppeteer";
import kpURLS from "../helpers/kpURLS";
import kpFrame from "../helpers/kpFrame";

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
	invoicePaymentMethod,
	debitPaymentMethod,
	creditPaymentMethod,

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
const selectedPaymentMethod = invoicePaymentMethod;

// Coupon selection
const appliedCoupons = [couponPercent];

//------------- 1
/**
 *
 * @param page
 * @param name
 * @returns {Promise<*|Frame>}
 */
 const loadIFrame = async (page, name) =>
 page.frames().find((frame) => frame.name() === name);
//------------- 1XXX




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
			// context.close();
		}
	}, 900000);

	/**
	 * Begin test suite
	 */
	test("second flow should be on the my account page", async () => {
		// await page.goto("http://localhost:8000");
		await page.goto("http://localhost:8000/shop/?add-to-cart=1547");
		await page.waitForTimeout(1000);
		await page.goto("http://localhost:8000/checkout");



		await page.waitForSelector('label[for="payment_method_klarna_payments_pay_later"]');
		await page.evaluate(
			(cb) => cb.click(),
			await page.$('label[for="payment_method_klarna_payments_pay_later"]')
		);


//---------------------o 2

await kpFrame.submitBillingForm(page, billingData);

//---------------------x 2


		await page.waitForTimeout(2000);

		const framePayLater = await loadIFrame(
			page,
			"klarna-pay-later-main"
		);

		// await framePayLater.waitForSelector('label[for="installments-invoice|-1"]');
		// await framePayLater.evaluate(
		// 	(cb) => cb.click(),
		// 	await framePayLater.$('label[for="installments-pix|3504"]')
		// );

		// await page.waitForTimeout(500);

		await framePayLater.evaluate(
			(cb) => cb.click(),
			await framePayLater.$('label[for="installments-invoice|-1"]')
		);

		await framePayLater.evaluate(
			(cb) => cb.click(),
			await framePayLater.$('label[for="installments-invoice|-1"]')
		);

		// await page.waitForTimeout(500);

		await page.evaluate(
			(cb) => cb.click(),
			await page.$('input[type="checkbox"][name="terms"][id="terms"]')
		);

		await page.waitForTimeout(500);

		await page.evaluate(
			(cb) => cb.click(),
			await page.$('button[type="submit"][name="woocommerce_checkout_place_order"][id="place_order"]')
		);

		await page.waitForTimeout(1000);

		// PIN NUMBER
		const framePayLaterFullScreen = await loadIFrame(
			page,
			"klarna-pay-later-fullscreen"
		);

		await page.evaluate(
			(cb) => cb.click(),
			await page.$('button[type="submit"][name="woocommerce_checkout_place_order"][id="place_order"]')
		);

		await framePayLaterFullScreen.evaluate(
			(cb) => cb.click(),
			await framePayLaterFullScreen.$('input[name="nationalIdentificationNumber"]')
		);
		await framePayLaterFullScreen.type('input[name="nationalIdentificationNumber"]', "410321-9202");

		await framePayLaterFullScreen.evaluate(
			(cb) => cb.click(),
			await framePayLaterFullScreen.$('button[id="purchase-approval-form-continue-button"]')
		);

		const h1 = await page.$eval("h1", (e) => e.textContent);
		expect(h1).toBe("Checkout");
	}, 190000);
});
