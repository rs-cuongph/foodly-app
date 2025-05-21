const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin({
  requestConfig: './i18n/request.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5200',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5200',
      },
      {
        protocol: 'https',
        hostname: 'foodly.talentgrid.io.vn',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
