import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML serving from public directory
  output: 'standalone',
  
  // Configure headers for WebSocket support
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        ],
      },
    ];
  },
};

export default nextConfig;

