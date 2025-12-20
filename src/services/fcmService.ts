import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// VAPID key from Firebase Console -> Project Settings -> Cloud Messaging
// Loaded from environment variable VITE_FIREBASE_VAPID_KEY
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

class FCMService {
  private messaging: any = null;
  private currentToken: string | null = null;

  // Initialize Firebase Messaging
  async initialize() {
    try {
      // Check if browser supports notifications
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }

      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        console.log('Service workers are not supported');
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);

      // Get messaging instance using the existing Firebase app
      const { getMessaging } = await import('firebase/messaging');
      const { default: firebaseApp } = await import('@/lib/firebase');
      
      // Use the existing Firebase app instance
      this.messaging = getMessaging(firebaseApp);

      console.log('FCM Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing FCM Service:', error);
      return false;
    }
  }

  // Request notification permission only
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Register FCM token (works even without notification permission)
  async registerToken(userId: string): Promise<string | null> {
    try {
      // Check if already initialized
      if (!this.messaging) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      // Get FCM token (works even without notification permission)
      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready
      });

      if (token) {
        console.log('FCM Token obtained:', token);
        this.currentToken = token;

        // Save token to Firestore
        await this.saveTokenToFirestore(userId, token);

        // Setup foreground message handler
        this.setupForegroundMessageHandler();

        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Request notification permission and register FCM token
  async requestPermissionAndGetToken(userId: string): Promise<string | null> {
    try {
      // First, ask for notification permission
      const permissionGranted = await this.requestPermission();
      
      // Register token regardless of permission (so we can use it later if they grant permission)
      const token = await this.registerToken(userId);
      
      if (permissionGranted && token) {
        console.log('FCM token registered with notification permission');
      } else if (token) {
        console.log('FCM token registered (notification permission can be granted later)');
      }
      
      return token;
    } catch (error) {
      console.error('Error in requestPermissionAndGetToken:', error);
      return null;
    }
  }

  // Save FCM token to Firestore in user_profiles
  private async saveTokenToFirestore(userId: string, token: string) {
    try {
      const browserInfo = navigator.userAgent;
      const deviceInfo = {
        token,
        platform: 'web',
        browser: browserInfo,
        lastUpdated: new Date().toISOString()
      };

      // Get current user profile
      const userProfileRef = doc(db, 'user_profiles', userId);
      const userProfileSnap = await getDoc(userProfileRef);
      
      let currentTokens: any[] = [];
      if (userProfileSnap.exists()) {
        const data = userProfileSnap.data();
        currentTokens = data.fcmTokens || [];
      }

      // Check if token from this browser already exists
      const existingTokenIndex = currentTokens.findIndex(
        (t: any) => t.token === token || (t.platform === 'web' && t.browser === browserInfo)
      );

      if (existingTokenIndex !== -1) {
        // Update existing token
        currentTokens[existingTokenIndex] = deviceInfo;
        console.log('FCM token refreshed in user_profiles');
      } else {
        // Add new token
        currentTokens.push(deviceInfo);
        console.log('FCM token added to user_profiles');
      }

      // Store in user_profiles collection
      await setDoc(userProfileRef, { fcmTokens: currentTokens }, { merge: true });
    } catch (error) {
      console.error('Error saving FCM token to Firestore:', error);
    }
  }

  // Setup handler for foreground messages (when app is open)
  private setupForegroundMessageHandler() {
    if (!this.messaging) {
      console.warn('[FCM] Cannot setup foreground handler: messaging not initialized');
      return;
    }

    try {
      onMessage(this.messaging, (payload) => {
        console.log('[FCM] Foreground message received:', payload);
        console.log('[FCM] Notification data:', payload.notification);
        console.log('[FCM] Data payload:', payload.data);

        // Extract notification title and body
        const notificationTitle = payload.notification?.title || 
                                 payload.data?.title || 
                                 'TaskMate Reminder';
        const notificationBody = payload.notification?.body || 
                                payload.data?.body || 
                                payload.data?.description ||
                                'You have a task reminder';

        const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
          body: notificationBody,
          icon: '/assets/logo.png',
          badge: '/badge.png',
          tag: payload.data?.taskId || 'task-reminder',
          data: {
            ...payload.data,
            url: payload.data?.url || payload.fcmOptions?.link || '/',
          },
          vibrate: [200, 100, 200],
          requireInteraction: true,
          // Add action buttons if available
          ...(payload.data?.taskId && {
            actions: [
              {
                action: 'complete',
                title: '✓ Mark as Done',
              },
              {
                action: 'snooze',
                title: '⏰ Snooze 10 min',
              }
            ]
          })
        };

        // Check notification permission
        if (Notification.permission === 'granted') {
          console.log('[FCM] Showing foreground notification:', notificationTitle);
          const notification = new Notification(notificationTitle, notificationOptions);
          
          // Handle notification click
          notification.onclick = (event) => {
            event.preventDefault();
            console.log('[FCM] Notification clicked:', payload.data);
            // Focus or open the app window
            window.focus();
            // You can navigate to a specific route here if needed
            if (payload.data?.taskId) {
              // Navigate to task detail page if needed
              console.log('[FCM] Task ID:', payload.data.taskId);
            }
          };
        } else {
          console.warn('[FCM] Notification permission not granted. Permission:', Notification.permission);
          // Request permission if not granted
          if (Notification.permission === 'default') {
            console.log('[FCM] Requesting notification permission...');
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                console.log('[FCM] Permission granted, showing notification');
                new Notification(notificationTitle, notificationOptions);
              }
            });
          }
        }
      });
      console.log('[FCM] Foreground message handler setup complete');
    } catch (error) {
      console.error('[FCM] Error setting up foreground message handler:', error);
    }
  }

  // Get current token
  getCurrentToken(): string | null {
    return this.currentToken;
  }

  // Delete token (on logout)
  async deleteToken(userId: string): Promise<boolean> {
    try {
      if (!this.messaging || !this.currentToken) {
        return false;
      }

      // Delete from FCM
      await deleteToken(this.messaging);

      // Remove token from user_profiles
      const userProfileRef = doc(db, 'user_profiles', userId);
      const userProfileSnap = await getDoc(userProfileRef);
      
      if (userProfileSnap.exists()) {
        const data = userProfileSnap.data();
        const currentTokens = (data.fcmTokens || []).filter((t: any) => t.token !== this.currentToken);
        await setDoc(userProfileRef, { fcmTokens: currentTokens }, { merge: true });
      }

      this.currentToken = null;
      console.log('FCM token deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      return false;
    }
  }

  // Cleanup old tokens (optional - can be called periodically)
  async cleanupOldTokens(userId: string, daysOld: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      const cutoffDateStr = cutoffDate.toISOString();

      const userProfileRef = doc(db, 'user_profiles', userId);
      const userProfileSnap = await getDoc(userProfileRef);
      
      if (userProfileSnap.exists()) {
        const data = userProfileSnap.data();
        const currentTokens = data.fcmTokens || [];
        
        // Filter out old tokens
        const validTokens = currentTokens.filter((t: any) => 
          t.lastUpdated && t.lastUpdated > cutoffDateStr
        );
        
        const removedCount = currentTokens.length - validTokens.length;
        
        if (removedCount > 0) {
          await setDoc(userProfileRef, { fcmTokens: validTokens }, { merge: true });
          console.log(`Cleaned up ${removedCount} old tokens`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old tokens:', error);
    }
  }
}

export const fcmService = new FCMService();
