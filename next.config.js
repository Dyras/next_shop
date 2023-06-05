/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "pic8.co",
				port: "",
				pathname: "/sh/**",
			},
			{
				protocol: "https",
				hostname: "images2.imgbox.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
