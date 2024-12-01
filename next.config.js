/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.axotl.org'],
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.NODE_ENV === 'production' 
          ? 'api.axotl.org'
          : 'localhost',
        port: process.env.NODE_ENV === 'production' ? '' : '3001',
        pathname: '/assets/**',
      },
    ],
  },
}

module.exports = nextConfig 