import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL ? 
  import.meta.env.VITE_API_URL.replace('/api', '') : 
  'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  initialize() {
    if (this.socket) return this.socket;

    console.log('📡 Socket.io: Connecting to', SOCKET_URL);
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.io: Connected to server');
      
      // Auto-join user room if we have a user in local storage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.id) {
            this.socket?.emit('join_user_room', user.id);
          }
        } catch (e) {
          console.error('Error parsing user for socket join:', e);
        }
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.io: Disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.io: Connection error:', error);
    });

    return this.socket;
  }

  joinUserRoom(userId: string) {
    if (!this.socket) this.initialize();
    this.socket?.emit('join_user_room', userId);
  }

  joinGroupRoom(groupId: string) {
    if (!this.socket) this.initialize();
    this.socket?.emit('join_group_room', groupId);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) this.initialize();
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
