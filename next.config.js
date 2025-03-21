/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer }) => {
    // Ignorar o aviso do fsevents
    config.ignoreWarnings = [
      { module: /node_modules\/fsevents/ }
    ];
    return config;
  }
}

module.exports = nextConfig 