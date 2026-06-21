/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@stellar-circles/shared"],
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  experimental: {
    outputFileTracingRoot: require("path").join(__dirname, "../../"),
  },
};

module.exports = nextConfig;
