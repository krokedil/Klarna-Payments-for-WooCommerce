const { execSync } = require("child_process");
require("dotenv").config();
const waitOn = require("wait-on");

const { PLUGIN_NAME, WC, WC_VERSION } = process.env;

// TODO
const executeCommand = (command) => {
	const dockerRunCLI = `docker-compose run --rm wordpress-cli`;
	execSync(`${dockerRunCLI} ${command}`, {
		stdio: "inherit",
	});
};
// TODO
const wpInstallCommand = (params) => {
	const { title, admin, pass, email, url } = params;
	return `wp core install --title="${title}" --admin_user=${admin} --admin_password=${pass} --admin_email=${email} --skip-email --url=${url}`;
};

// TODO
const installWP = () => {
	const data = {
		title: "E2E Tests",
		admin: "admin",
		pass: "password",
		email: "info@example.com",
		url: "http://localhost:8000",
	};
	const installCommand = wpInstallCommand(data);
	executeCommand(installCommand);
};

// TODO
const installWC = () => {
	executeCommand(
		`wp plugin install ${WC} --version=${WC_VERSION} --activate`
	);
};
// TODO
const installTheme = (themeName = "storefront") => {
	executeCommand(`wp theme install ${themeName}`);
};

// TODO
const activateKP = () => executeCommand(`wp plugin activate ${PLUGIN_NAME}`);

// TODO
const importDb = () =>
	executeCommand(
		`wp db import ./wp-content/plugins/${PLUGIN_NAME}/tests/e2e/bin/data.sql`
	);

// TODO
waitOn({ resources: [`http://localhost:8000`] }).then(() => {
	try {
		// do stuff.
		installWP();
		installWC();
		installTheme();
		activateKP();
		importDb();
	} catch (error) {
		console.log(error);
	}
});
