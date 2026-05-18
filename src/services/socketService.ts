import { io, Socket } from 'socket.io-client';

const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Use string replacement instead of URL object to avoid 'ws://https/' malformed URLs
const SOCKET_URL = baseApiUrl.replace(/\/api$/, '').replace(/\/api\/$/, '');

class SocketService {
  private socket: Socket | null = null;

  initialize() {
    if (this.socket) return this.socket;

    console.log('📡 Socket.io: Connecting to', SOCKET_URL);
    this.socket = io(SOCKET_URL, {
      path: "/socket.io/",
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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

  joinNoteRoom(noteId: string) {
    if (!this.socket) this.initialize();
    this.socket?.emit('join_note_room', noteId);
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
