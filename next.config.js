/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === 'mobile';

const nextConfig = {
  reactStrictMode: true,
  // The iOS / Android apps bundle a static copy of the site (see capacitor.config.ts)
  ...(isMobile && { output: 'export', images: { unoptimized: true } }),
};

module.exports = nextConfig;
