/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Support both Clerk avatars and Cloudinary assets
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

export default nextConfig;
