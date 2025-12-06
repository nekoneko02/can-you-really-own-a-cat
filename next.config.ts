import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable React Strict Mode to avoid Phaser initialization issues
  // TODO: Re-enable after fixing cleanup race condition
  reactStrictMode: false,
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  // Output optimization for production
  output: 'standalone',
  // Image optimization
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
