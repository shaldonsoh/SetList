/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com'  // For uploaded images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Allow all HTTPS domains temporarily for development
      }
    ]
  }
}

module.exports = nextConfig 