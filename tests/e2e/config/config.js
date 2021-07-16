import config from "./config.data.json";

export const adminData = config?.users?.admin;
export const customerData = config.users.customer;
export const productIdData = config.products.product_id;
export const siteUrl = config.url;

const settingsArray = {
	woocommerce_klarna_payments_settings: {
		enabled: "yes",
		title: "Klarna Payments In Progress",
		testmode: "yes",
		logging: "yes",
		credentials_us: "",
		merchant_id_us: "",
		shared_secret_us: "",
		test_merchant_id_us: "",
		test_shared_secret_us: "",
		send_product_urls: "yes",
		radius_border: "",
		add_to_email: "no",
		customer_type: "b2c",

		credentials_au: "",
		merchant_id_au: "",
		shared_secret_au: "",
		test_merchant_id_au: "",
		test_shared_secret_au: "",

		credentials_at: "",
		merchant_id_at: "",
		shared_secret_at: "",
		test_merchant_id_at: "",
		test_shared_secret_at: "",

		credentials_be: "",
		merchant_id_be: "",
		shared_secret_be: "",
		test_merchant_id_be: "",
		test_shared_secret_be: "",

		credentials_ca: "",
		merchant_id_ca: "",
		shared_secret_ca: "",
		test_merchant_id_ca: "",
		test_shared_secret_ca: "",

		credentials_dk: "",
		merchant_id_dk: "",
		shared_secret_dk: "",
		test_merchant_id_dk: "",
		test_shared_secret_dk: "",

		credentials_de: "",
		merchant_id_de: "",
		shared_secret_de: "",
		test_merchant_id_de: "",
		test_shared_secret_de: "",

		credentials_fi: "",
		merchant_id_fi: "",
		shared_secret_fi: "",
		test_merchant_id_fi: "",
		test_shared_secret_fi: "",

		credentials_fr: "",
		merchant_id_fr: "",
		shared_secret_fr: "",
		test_merchant_id_fr: "",
		test_shared_secret_fr: "",

		credentials_it: "",
		merchant_id_it: "",
		shared_secret_it: "",
		test_merchant_id_it: "",
		test_shared_secret_it: "",

		credentials_nl: "",
		merchant_id_nl: "",
		shared_secret_nl: "",
		test_merchant_id_nl: "",
		test_shared_secret_nl: "",

		credentials_no: "",
		merchant_id_no: "",
		shared_secret_no: "",
		test_merchant_id_no: "",
		test_shared_secret_no: "",

		credentials_nz: "",
		merchant_id_nz: "",
		shared_secret_nz: "",
		test_merchant_id_nz: "",
		test_shared_secret_nz: "",

		credentials_es: "",
		merchant_id_es: "",
		shared_secret_es: "",
		test_merchant_id_es: "",
		test_shared_secret_es: "",

		credentials_ch: "",
		merchant_id_ch: "",
		shared_secret_ch: "",
		test_merchant_id_ch: "",
		test_shared_secret_ch: "",

		credentials_gb: "",
		merchant_id_gb: "",
		shared_secret_gb: "",
		test_merchant_id_gb: "",
		test_shared_secret_gb: "",

		credentials_se: "",
		merchant_id_se: "",
		shared_secret_se: "",
		test_merchant_id_se: "K512807_cabfc48430bc",
		test_shared_secret_se: "CX2CyVdsqKQ6VF8W",
	},
};

export const shippingTargets = customerData.shipping.targets;
export const paymentSelectedMethod = customerData.payment.selectedMethod;
export const customerKey = customerData.api.consumerKey;
export const customerSecret = customerData.api.consumerSecret;
export const klarnaAuth = customerData.klarnaCredentials;

export const shippingSel = customerData.shippingSelectors;
export const freeShippingMethod = shippingSel.methods.freeShipping;
export const flatRateMethod = shippingSel.methods.flatRate;
export const freeShippingMethodTarget = shippingSel.targets.freeShippingTarget;
export const flatRateMethodTarget = shippingSel.targets.flatRateTarget;

export const creditPaymentMethod = paymentSelectedMethod.creditMethod;
export const payLaterPaymentMethod = paymentSelectedMethod.payLaterMethod;

export const customerName = customerData.first_name;
export const customerLastname = customerData.last_name;
export const customerEmail = customerData.email;
export const customerUsername = customerData.username;

export const simpleProduct25 = productIdData.simple_25;
export const simpleProduct12 = productIdData.simple_12;
export const simpleProduct6 = productIdData.simple_6;
export const simpleProduct0 = productIdData.simple_0;
export const simpleProductSale25 = productIdData.simple_sale_25;
export const simpleProductSale12 = productIdData.simple_sale_12;
export const simpleProductSale6 = productIdData.simple_sale_6;
export const simpleProductSale0 = productIdData.simple_sale_0;
export const variableProduct25Black = productIdData.variable_25_black;
export const variableProduct25Blue = productIdData.variable_25_blue;
export const variableProduct25Brown = productIdData.variable_25_brown;
export const variableProduct25Green = productIdData.variable_25_green;
export const variableProductMixedBlackS = productIdData.variable_mix_black_s;
export const variableProductMixedBlackM = productIdData.variable_mix_black_m;
export const variableProductMixedBlackL = productIdData.variable_mix_black_l;
export const variableProductMixedBlackXL = productIdData.variable_mix_black_xl;
export const variableProductMixedGreenS = productIdData.variable_mix_green_s;
export const variableProductMixedGreenM = productIdData.variable_mix_green_m;
export const variableProductMixedGreenL = productIdData.variable_mix_green_l;
export const variableProductMixedGreenXL = productIdData.variable_mix_green_xl;
export const variableProductVirtualDownloadable25 =
	productIdData.virtual_downloadable_25;
export const variableProductVirtualDownloadable12 =
	productIdData.virtual_downloadable_12;
export const variableProductVirtualDownloadable6 =
	productIdData.virtual_downloadable_6;
export const variableProductVirtualDownloadable0 =
	productIdData.virtual_downloadable_0;
export const variableProductVirtualDownloadableSale25 =
	productIdData.virtual_downloadable_sale_25;
export const variableProductVirtualDownloadableSale12 =
	productIdData.virtual_downloadable_sale_12;
export const variableProductVirtualDownloadableSale6 =
	productIdData.virtual_downloadable_sale_6;
export const variableProductVirtualDownloadableSale0 =
	productIdData.virtual_downloadable_0;

export const couponFixedCart = customerData.coupons.fixed_cart;
export const couponFixedProduct = customerData.coupons.fixed_product;
export const couponPercent = customerData.coupons.percent;
export const couponTotalFreeShipping = customerData.coupons.free_shipping;
export const couponTotalWithShipping = customerData.coupons.charged_shipping;

export const { pinNumber } = customerData;
export const { companyNumber } = customerData;
export const { cardNumber } = customerData;

export const timeOutTime = config.timeoutTime;
export const { billing } = customerData;
export const { shipping } = customerData;
export const customerAPIData = {
	email: customerEmail,
	first_name: customerName,
	last_name: customerLastname,
	username: customerUsername,
	billing,
	shipping,
};
export const { billingData } = customerData;

export const userCredentials = customerData.credentialsAndSelectors;

export const { klarnaOrderEndpoint } = adminData;
export const { puppeteerOptions } = config;

export const KPSettingsArray = settingsArray;
