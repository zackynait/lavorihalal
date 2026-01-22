/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com',
      },
    ],
  },
  // Disabilita Turbopack
  experimental: {
    turbo: false
  }
}

module.exports = nextConfig