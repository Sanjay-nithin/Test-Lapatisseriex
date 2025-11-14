// Utility to derive the Socket.IO base URL consistently in all environments.
// Preference order:
// 1. VITE_WS_URL (explicit WebSocket base)
// 2. VITE_API_URL (Render API) stripped of trailing /api path
// Fallback: http://localhost:3000
// Ensures https -> wss protocol conversion for production.

export function getWebSocketBaseUrl() {
  const explicit = import.meta.env.VITE_WS_URL?.trim();
  const api = import.meta.env.VITE_API_URL?.trim();
  let base = explicit || api || 'http://localhost:3000';

  // Strip trailing /api and anything after it
  base = base.replace(/\/?api(?:\/.*)?$/, '');

  // Keep protocol as http(s); Socket.IO will upgrade to ws(s) as needed.

  // Remove trailing slash
  base = base.replace(/\/$/, '');

  return base;
}

export function getSocketOptions(overrides = {}) {
  return {
    path: '/socket.io/',
    // Start with polling for better Render compatibility, then upgrade
    transports: ['polling', 'websocket'],
    upgrade: true,
    rememberUpgrade: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5,
    // Increase timeout for Render's network latency
    timeout: 30000,
    // Force new connection (helps with Render's architecture)
    forceNew: false,
    // Additional options for stability
    autoConnect: true,
    withCredentials: true,
    ...overrides
  };
}
