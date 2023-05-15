/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	localeDetection: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "pic8.co",
				port: "",
				pathname: "/sh/**",
			},
		],
	},
};

module.exports = nextConfig;
