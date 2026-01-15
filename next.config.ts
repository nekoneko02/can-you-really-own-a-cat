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
  // Phaser is client-side only - exclude from SSR
  serverExternalPackages: ['phaser'],
  // Turbopack configuration
  turbopack: {
    // Set root directory for worktree environment
    root: __dirname,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Phaser from server-side bundling
      config.externals = [...(config.externals || []), 'phaser'];
    }
    return config;
  },
};

export default nextConfig;
