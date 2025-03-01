/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: { loader: 'worker-loader' },
    });
    return config;
  },
  // output: 'standalone',
};

module.exports = nextConfig; 