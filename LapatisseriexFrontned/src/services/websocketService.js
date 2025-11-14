import { io } from 'socket.io-client';
import { getWebSocketBaseUrl, getSocketOptions } from '../utils/websocketUrl.js';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.userId = null;
    this.currentAuthId = null;
  }

  connect(userId) {
    const normalizedId = userId ? userId.toString() : null;

    if (normalizedId && this.userId !== normalizedId) {
      this.userId = normalizedId;

      if (this.socket && this.socket.connected) {
        if (this.currentAuthId && this.currentAuthId !== normalizedId) {
          this.socket.emit('logout');
        }
        this.socket.emit('authenticate', normalizedId);
        this.currentAuthId = normalizedId;
      }
    }

    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect();
      }

      if (this.socket.connected && this.userId && this.currentAuthId !== this.userId) {
        this.socket.emit('authenticate', this.userId);
        this.currentAuthId = this.userId;
      }

      return this.socket;
    }

  // Always derive WebSocket base from Render API (VITE_API_URL) and strip any trailing /api path.
  // This ensures we do NOT accidentally connect to the Vercel deployment which may not support persistent WS.
  const serverUrl = getWebSocketBaseUrl();
  console.log('[WebSocketService] Derived WebSocket base:', serverUrl);
  console.log('[WebSocketService] Attempting connection at:', new Date().toISOString());

    this.socket = io(serverUrl, getSocketOptions());

    if (normalizedId && !this.userId) {
      this.userId = normalizedId;
    }

    this.socket.on('connect', () => {
      console.log('✅ [WebSocketService] Connected to WebSocket server');
      console.log('   Socket ID:', this.socket.id);
      console.log('   Transport:', this.socket.io.engine.transport.name);
      this.connected = true;

      if (this.userId) {
        this.socket.emit('authenticate', this.userId);
        this.currentAuthId = this.userId;
        console.log('   Authenticated user:', this.userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ [WebSocketService] Disconnected from WebSocket server');
      console.log('   Reason:', reason);
      console.log('   Time:', new Date().toISOString());
      this.connected = false;
      this.currentAuthId = null;
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ [WebSocketService] Connection error:', error?.message || error);
      console.error('   Error type:', error?.type);
      console.error('   Description:', error?.description);
      this.connected = false;
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 [WebSocketService] Reconnection attempt #${attempt}`);
    });

    this.socket.io.on('reconnect', (attempt) => {
      console.log(`✅ [WebSocketService] Reconnected after ${attempt} attempts`);
    });

    this.socket.io.on('reconnect_error', (error) => {
      console.error('⚠️ [WebSocketService] Reconnection error:', error?.message);
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('❌ [WebSocketService] Reconnection failed - max attempts reached');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      if (this.currentAuthId) {
        this.socket.emit('logout');
      }
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.userId = null;
      this.currentAuthId = null;
    }
  }

  onOrderStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('orderStatusUpdate', callback);
    }
  }

  offOrderStatusUpdate(callback) {
    if (this.socket) {
      this.socket.off('orderStatusUpdate', callback);
    }
  }

  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('newNotification', callback);
    }
  }

  offNewNotification(callback) {
    if (this.socket) {
      this.socket.off('newNotification', callback);
    }
  }

  onShopStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('shopStatusUpdate', callback);
    }
  }

  offShopStatusUpdate(callback) {
    if (this.socket) {
      this.socket.off('shopStatusUpdate', callback);
    }
  }

  onOrderStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('orderStatusUpdated', callback);
    }
  }

  offOrderStatusUpdated(callback) {
    if (this.socket) {
      this.socket.off('orderStatusUpdated', callback);
    }
  }

  onNewOrderPlaced(callback) {
    if (this.socket) {
      this.socket.on('newOrderPlaced', callback);
    }
  }

  offNewOrderPlaced(callback) {
    if (this.socket) {
      this.socket.off('newOrderPlaced', callback);
    }
  }

  onPaymentUpdated(callback) {
    if (this.socket) {
      this.socket.on('paymentUpdated', callback);
    }
  }

  offPaymentUpdated(callback) {
    if (this.socket) {
      this.socket.off('paymentUpdated', callback);
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  getSocket() {
    return this.socket;
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
