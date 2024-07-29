/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@svgr/webpack"],
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.tsx",
        },
      },
    },
  },
};

module.exports = nextConfig;
