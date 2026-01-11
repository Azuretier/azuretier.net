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

  // Custom rewrites for multiplayer pages
  async rewrites() {
    return [
      {
        source: '/multiplayer/host',
        destination: '/app/RYTHMIA-NEXUS/host.html',
      },
      {
        source: '/multiplayer/player',
        destination: '/app/RYTHMIA-NEXUS/player.html',
      },
    ];
  },
};

export default nextConfig;

