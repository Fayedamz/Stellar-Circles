/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@stellar-circles/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" }, // for avatar generation
    ],
  },
};

module.exports = nextConfig;
