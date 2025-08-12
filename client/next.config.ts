/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? './' : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

module.exports = nextConfig;