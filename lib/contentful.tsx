const contentful = require("contentful");

const client = contentful.createClient({
	space: "jzgzgx8xni12",
	environment: "master", // defaults to 'master' if not set
	accessToken: "HoEgOr8jluRzoowQXwvkDnTs7Qp0y1r9kKNAN7pyqgw",
});

module.exports = {
	client,
};
