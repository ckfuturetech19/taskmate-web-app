import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { default as firebaseApp } from '@/lib/firebase';
import api from '@/services/apiService';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

class FCMService {
  private messaging = getMessaging(firebaseApp);
  private currentToken: string | null = null;

  async initialize() {
    try {
      if (!('Notification' in window)) return false;
      if (!('serviceWorker' in navigator)) return false;

      // Register service worker if not already registered
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      return true;
    } catch (error) {
      console.error('Error initializing FCM Service:', error);
      return false;
    }
  }

  async requestPermissionAndSaveToken(userId: string) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return null;

      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        this.currentToken = token;
        // Save to our custom backend
        await api.put('/users/profile', { webFcmToken: token });
        console.log('FCM Web Token saved to backend');
        this.setupForegroundHandler();
      }
      return token;
    } catch (error) {
      console.error('Error in FCM requestPermissionAndSaveToken:', error);
      return null;
    }
  }

  private setupForegroundHandler() {
    onMessage(this.messaging, (payload) => {
      console.log('Foreground message:', payload);
      // You can trigger a toast or notification here
    });
  }

  async deleteToken() {
    try {
      if (this.messaging) {
        await deleteToken(this.messaging);
        await api.put('/users/profile', { webFcmToken: null });
        this.currentToken = null;
      }
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }
}

export const fcmService = new FCMService();
