import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// OneSignal API keys - should match Flutter app
const ONESIGNAL_APP_ID = '50dcd171-4294-470b-b898-1e9557cb595a';
const ONESIGNAL_REST_API_KEY = 'os_v2_app_kdonc4kcsrdqxoeyd2kvps2zliljufconvzuhnujb45qw4jhcujue2loowa3icdxmvsvixz3t4f257fakhxnhl45aqphly3xzgle2ki';

// Declare OneSignal types for TypeScript
declare global {
  interface Window {
    OneSignal?: any;
  }
}

/**
 * OneSignal service for web push notifications
 * Matches the Flutter app's notification system
 */
class OneSignalService {
  private isInitialized = false;

  /**
   * Initialize OneSignal SDK
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('⚠️ OneSignal already initialized');
      return true;
    }

    try {
      // Wait for OneSignal to be available (loaded from CDN)
      if (typeof window !== 'undefined' && window.OneSignal) {
        const OneSignal = window.OneSignal;
        
        // Initialize OneSignal with service worker
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          notifyButton: {
            enable: false, // We'll handle notification permission ourselves
          },
          allowLocalhostAsSecureOrigin: true, // For development
          serviceWorkerParam: {
            scope: '/',
          },
          serviceWorkerPath: '/OneSignalSDKWorker.js',
        });

        this.isInitialized = true;
        console.log('✅ OneSignal initialized successfully');
        return true;
      } else {
        // Wait a bit and try again if OneSignal script hasn't loaded yet
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (window.OneSignal) {
          return await this.initialize();
        }
        console.warn('⚠️ OneSignal SDK not loaded yet');
        return false;
      }
    } catch (e) {
      console.error('❌ Error initializing OneSignal:', e);
      return false;
    }
  }

  /**
   * Request notification permission and save Player ID
   */
  async requestPermissionAndSavePlayerId(userId: string): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return null;
        }
      }

      if (typeof window === 'undefined' || !window.OneSignal) {
        console.warn('⚠️ OneSignal SDK not available');
        return null;
      }

      const OneSignal = window.OneSignal;

      // Request permission
      const permission = await OneSignal.Notifications.requestPermission();
      
      if (permission) {
        // Get Player ID
        const playerId = await OneSignal.User.PushSubscription.id;
        
        if (playerId) {
          console.log('📱 OneSignal Player ID:', playerId);
          
          // Save to Firestore (same structure as Flutter app)
          await this.savePlayerIdToFirestore(userId, playerId);
          
          // Listen for Player ID changes
          OneSignal.User.PushSubscription.addEventListener('change', () => {
            const newPlayerId = OneSignal.User.PushSubscription.id;
            if (newPlayerId) {
              this.savePlayerIdToFirestore(userId, newPlayerId);
            }
          });

          // Handle notification clicks
          OneSignal.Notifications.addEventListener('click', (event: any) => {
            console.log('🔔 OneSignal notification clicked:', event);
            const data = event.notification.additionalData;
            if (data) {
              const groupId = data.groupId;
              const taskId = data.taskId;
              console.log('   Data: groupId=', groupId, 'taskId=', taskId);
              // Navigate to the group if clicked
              if (groupId) {
                window.location.href = `/groups/${groupId}`;
              }
            }
          });

          return playerId;
        }
      }

      return null;
    } catch (e) {
      console.error('❌ Error requesting OneSignal permission:', e);
      return null;
    }
  }

  /**
   * Save Player ID to Firestore (same structure as Flutter app)
   */
  private async savePlayerIdToFirestore(userId: string, playerId: string): Promise<void> {
    try {
      const userProfileRef = doc(db, 'user_profiles', userId);
      
      await setDoc(userProfileRef, {
        onesignalPlayerId: playerId,
        onesignalPlayerIdUpdatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log('✅ OneSignal Player ID saved to user profile');
    } catch (e) {
      console.error('❌ Error saving OneSignal Player ID:', e);
    }
  }
  /**
   * Get Player IDs for a list of user IDs
   */
  async getPlayerIds(userIds: string[]): Promise<string[]> {
    if (userIds.length === 0) return [];

    try {
      const playerIds: string[] = [];

      // Fetch user profiles in batches
      for (const userId of userIds) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const profileRef = doc(db, 'user_profiles', userId);
          const profileSnapshot = await getDoc(profileRef);

          if (profileSnapshot.exists()) {
            const profileData = profileSnapshot.data();
            const playerId = profileData.onesignalPlayerId as string | undefined;
            if (playerId && playerId.length > 0) {
              playerIds.push(playerId);
            }
          }
        } catch (e) {
          console.warn(`⚠️ Error fetching Player ID for user ${userId}:`, e);
        }
      }

      console.log(`📱 Found ${playerIds.length} Player IDs out of ${userIds.length} users`);
      return playerIds;
    } catch (e) {
      console.error('❌ Error getting Player IDs:', e);
      return [];
    }
  }

  /**
   * Send OneSignal push notification
   */
  async sendNotification({
    playerIds,
    title,
    message,
    type,
    groupId,
    taskId,
  }: {
    playerIds: string[];
    title: string;
    message: string;
    type: string;
    groupId: string;
    taskId?: string;
  }): Promise<boolean> {
    if (playerIds.length === 0) {
      console.warn('⚠️ No Player IDs to send notification to');
      return false;
    }

    try {
      const url = 'https://onesignal.com/api/v1/notifications';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
      };

      const body: any = {
        app_id: ONESIGNAL_APP_ID,
        include_player_ids: playerIds,
        headings: { en: title },
        contents: { en: message },
        data: {
          type,
          groupId,
          ...(taskId && { taskId }),
        },
        priority: 10, // High priority
      };

      // Note: android_channel_id is only for Android apps, not web push
      // Web push notifications don't use channels

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log(`✅ OneSignal notification sent successfully to ${playerIds.length} devices`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ OneSignal API error: ${response.status} - ${errorText}`);
        return false;
      }
    } catch (e) {
      console.error('❌ Error sending OneSignal notification:', e);
      return false;
    }
  }

  /**
   * Send notification to all group members
   */
  async sendNotificationToGroup({
    groupId,
    title,
    message,
    type,
    taskId,
    targetMemberIds,
  }: {
    groupId: string;
    title: string;
    message: string;
    type: string;
    taskId?: string;
    targetMemberIds: string[];
  }): Promise<void> {
    try {
      // Get Player IDs for all target members
      const playerIds = await this.getPlayerIds(targetMemberIds);
      
      if (playerIds.length === 0) {
        console.warn('⚠️ No OneSignal Player IDs found for group members');
        return;
      }

      // Send notification
      await this.sendNotification({
        playerIds,
        title,
        message,
        type,
        groupId,
        taskId,
      });
    } catch (e) {
      console.error('❌ Error sending OneSignal notification to group:', e);
      // Don't throw - Firestore notification is already saved
    }
  }
}

export const oneSignalService = new OneSignalService();

