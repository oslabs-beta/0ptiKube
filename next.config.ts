/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com']
  },
  experimental: {
  }
}

module.exports = nextConfig

