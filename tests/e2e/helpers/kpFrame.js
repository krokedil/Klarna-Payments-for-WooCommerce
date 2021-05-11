
/**
 *
 * @param page
 * @param name
 * @returns {Promise<*|Frame>}
 */
 const loadIFrame = async (page, name) =>
 page.frames().find((frame) => frame.name() === name);


/**
 *
 * @param frame
 * @param data
 * @returns {Promise<void>}
 */

 const submitBillingForm = async (frame, data) => {
	const {
		emailSelector,
		email,
		postalCodeSelector,
		postalCode,
		firstNameSelector,
		firstName,
		lastNameSelector,
		lastName,
		telephoneSelector,
		telephone,
        cityNameSelector,
        cityName,
        billingAddressSelector,
        billingAddress

	} = data;

	// Fill out input field
	const fillOutFrameField = async (fieldName, inputFieldFillIn) => {

		if (await frame.$(fieldName)){

			let inputField = await frame.$(fieldName);
			await inputField.click({clickCount: 3});
			await inputField.press('Backspace');
			await frame.waitForTimeout(100);
			await inputField.type(inputFieldFillIn);
			await frame.waitForTimeout(200);
		}
	}

	// Fill out the form
	const completeForm = async () => {
		await fillOutFrameField(firstNameSelector, firstName);
		await fillOutFrameField(lastNameSelector, lastName);
		await fillOutFrameField(emailSelector, email);
		await fillOutFrameField(telephoneSelector, telephone);
		await fillOutFrameField(postalCodeSelector, postalCode);
		await fillOutFrameField(cityNameSelector, cityName);
		await fillOutFrameField(billingAddressSelector, billingAddress);
	}
	
	// Check for miniaturized frame
		if(	await frame.$('[id="preview__link"]')) {
			await frame.waitForTimeout(1000);
			await frame.click('[id="preview__link"]');
			await frame.waitForTimeout(1000);
		}
	
        await completeForm();
};

export default {
    loadIFrame,
    submitBillingForm,
}