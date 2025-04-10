const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ['localhost', '127.0.0.1'],
  },
};

module.exports = withNextIntl(nextConfig);
