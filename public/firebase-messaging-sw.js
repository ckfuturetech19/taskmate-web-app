// Firebase Cloud Messaging Service Worker
// This file must be in the public directory and will be served at the root

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
// Load Firebase config from separate file
// Note: In production, you should inject env vars during build
importScripts('./firebase-config.js');

// Initialize Firebase in the service worker
// Using config from firebase-config.js which should be updated during build
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message:', payload);
  console.log('[SW] Notification payload:', payload.notification);
  console.log('[SW] Data payload:', payload.data);

  // Extract notification title and body from various possible locations
  const notificationTitle = payload.notification?.title || 
                           payload.data?.title || 
                           'TaskMate Reminder';
  const notificationBody = payload.notification?.body || 
                          payload.data?.body || 
                          payload.data?.description ||
                          'You have a task reminder';

  console.log('[SW] Notification title:', notificationTitle);
  console.log('[SW] Notification body:', notificationBody);

  const notificationOptions = {
    body: notificationBody,
    icon: '/logo.png',
    badge: '/badge.png',
    tag: payload.data?.taskId || 'task-reminder',
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || '/',
      taskId: payload.data?.taskId,
      userId: payload.data?.userId,
      groupId: payload.data?.groupId || '',
      isGroupTask: payload.data?.isGroupTask || 'false',
      type: payload.data?.type || 'reminder',
      collection: payload.data?.collection || 'userSyncData'
    },
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'complete',
        title: '✓ Mark as Done'
      },
      {
        action: 'snooze',
        title: '⏰ Snooze 10 min'
      }
    ]
  };

  console.log('[SW] Showing notification with options:', notificationOptions);

  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log('[SW] Notification shown successfully');
    })
    .catch((error) => {
      console.error('[SW] Error showing notification:', error);
    });
});

// Handle notification clicks and action buttons
self.addEventListener('notificationclick', async (event) => {
  console.log('[Service Worker] Notification click received:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'complete') {
    // Mark task as complete
    console.log('Marking task as complete:', data.taskId);
    
    event.waitUntil(
      // Get auth token from IndexedDB or ask user to login
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(async (windowClients) => {
          // Try to get auth token from an open window
          let authToken = null;
          
          // If app is open, post message to get auth token
          if (windowClients.length > 0) {
            const client = windowClients[0];
            
            // Post message and wait for response
            const channel = new MessageChannel();
            return new Promise((resolve) => {
              channel.port1.onmessage = (event) => {
                authToken = event.data.token;
                resolve(authToken);
              };
              
              client.postMessage({ 
                type: 'GET_AUTH_TOKEN',
                action: 'complete',
                taskId: data.taskId,
                userId: data.userId,
                isGroupTask: data.isGroupTask === 'true',
                groupId: data.groupId || null,
              }, [channel.port2]);
            });
          }
          return null;
        })
        .then(() => {
          // Show success notification
          return self.registration.showNotification('Task Completed', {
            body: 'Task has been marked as done',
            icon: '/logo.png',
            badge: '/badge.png',
            tag: 'task-complete',
          });
        })
        .catch(error => {
          console.error('Error marking task complete:', error);
          // Show error notification
          return self.registration.showNotification('Open App', {
            body: 'Please open the app to mark task as complete',
            icon: '/logo.png',
            badge: '/badge.png',
            tag: 'task-error',
          });
        })
    );
  } else if (action === 'snooze') {
    // Snooze reminder for 10 minutes
    console.log('Snoozing reminder for 10 minutes:', data.taskId);
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          if (windowClients.length > 0) {
            const client = windowClients[0];
            
            // Post message to app to handle snooze
            const channel = new MessageChannel();
            return new Promise((resolve) => {
              channel.port1.onmessage = (event) => {
                resolve(event.data);
              };
              
              client.postMessage({ 
                type: 'GET_AUTH_TOKEN',
                action: 'snooze',
                taskId: data.taskId,
                userId: data.userId,
                isGroupTask: data.isGroupTask === 'true',
                groupId: data.groupId || null,
                snoozeMinutes: 10,
              }, [channel.port2]);
            });
          }
          return null;
        })
        .then(() => {
          // Show success notification
          return self.registration.showNotification('Reminder Snoozed', {
            body: 'You will be reminded again in 10 minutes',
            icon: '/logo.png',
            badge: '/badge.png',
            tag: 'task-snooze',
          });
        })
        .catch(error => {
          console.error('Error snoozing reminder:', error);
          return self.registration.showNotification('Open App', {
            body: 'Please open the app to snooze reminder',
            icon: '/logo.png',
            badge: '/badge.png',
            tag: 'task-error',
          });
        })
    );
  } else {
    // Default action - open the app
    const urlToOpen = data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there's already a window open
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
