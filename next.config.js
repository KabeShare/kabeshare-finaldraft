/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Keep config in sync with next.config.mjs
    domains: ['img.clerk.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
