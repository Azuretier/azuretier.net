/**
 * WebSocket and configuration utilities
 */

export const getWebSocketUrl = () => {
  if (typeof window === 'undefined') return '';
  
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    // Use same host with wss protocol in production
    return `wss://${window.location.host}`;
  }
  // Development: Connect to local WebSocket server
  return 'ws://localhost:3001';
};

export const config = {
  maxPlayers: 8,
  roomCodeLength: 6,
  maxChatMessageLength: 200,
  maxPlayerNameLength: 20,
};
