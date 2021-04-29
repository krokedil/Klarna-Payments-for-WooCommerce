import puppeteer from "puppeteer";
import kpURLS from "../helpers/kpURLS";

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

// Shipping in KCO iFrame ("yes") / Standard WC ("no")
const iframeShipping = "yes";

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
		await page.goto("http://localhost:8000");
		await page.waitForTimeout(2000);
		const h1 = await page.$eval("h1", (e) => e.textContent);
		expect(h1).toBe("Welcome");
	}, 190000);
});
