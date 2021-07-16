import API from "../api/API";
import { KPSettingsArray } from "../config/config";

/** Select a payment option tab
 *
 * @param {*} window
 * @param {*} selector
 */
const selectOptionTab = async (window, selector, wait) => {
	if (wait === true) {
		await window.waitForSelector(selector);
		await window.evaluate((cb) => cb.click(), await window.$(selector));
	} else {
		await window.evaluate((cb) => cb.click(), await window.$(selector));
	}
};

/** Fill out the selected payment option tab
 *
 * @param {*} window
 * @param {*} entrySelector
 * @param {*} exitSelector
 * @param {*} input
 */
const fillOptionTab = async (window, entrySelector, exitSelector, input) => {
	selectOptionTab(window, entrySelector, true);

	for (let i = 0; i < input.length; i += 1) {
		await window.type(entrySelector, input[i]);
	}

	selectOptionTab(window, exitSelector, false);
};

/** Create a helper array
 *
 * @param {*} mainArray
 * @param {*} helperArray
 */
const createHelperArray = (mainArray, helperArray) => {
	mainArray.forEach((element) => {
		if (!helperArray.includes(element)) {
			helperArray.push(element);
		}
	});
};

/**
 * Select cutomer type B2B / B2C
 *
 * @param {*} toggleSwitch
 */
const toggleCustomerType = async (toggleSwitch) => {
	KPSettingsArray.woocommerce_klarna_payments_settings.customer_type = toggleSwitch;
	await API.updateOptions(KPSettingsArray);
};

/**
 *
 * Check for input - continue if flase
 *
 * @param {*} frame
 * @param {*} page
 * @param {*} inputValue
 * @param {*} selector
 * @param {*} time
 */
const expectInput = async (frame, page, inputValue, selector, time) => {
	try {
		await page.waitForTimeout(2 * time);
		await frame.type(selector, inputValue);
	} catch {
		// Proceed
	}
};

export default {
	selectOptionTab,
	createHelperArray,
	toggleCustomerType,
	expectInput,
	fillOptionTab,
};
