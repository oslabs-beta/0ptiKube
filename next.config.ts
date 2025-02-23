/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com']
  },
  experimental: {
    serverActions: true,
  },
  // Only need these essential settings for Ingress
  httpAgentOptions: {
    keepAlive: true,
  },
  // Simple server config to bind to all interfaces for Ingress
  server: {
    hostname: '0.0.0.0',
    port: 3000
  }
}

module.exports = nextConfig