// Firebase Cloud Messaging Service Worker
// This file must be in the public directory and will be served at the root

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBU1on-3Dn33IsUfdoHYi3kluC63FIA2bs",
  authDomain: "taskmate-e7cc9.firebaseapp.com",
  projectId: "taskmate-e7cc9",
  storageBucket: "taskmate-e7cc9.firebasestorage.app",
  messagingSenderId: "425325230785",
  appId: "1:425325230785:web:5471398c240d7d8d46b240",
  measurementId: "G-0921EG4E7W"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'TaskMate Reminder';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a task reminder',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: payload.data?.taskId || 'task-reminder',
    data: {
      url: payload.data?.url || '/',
      taskId: payload.data?.taskId,
      userId: payload.data?.userId,
      groupId: payload.data?.groupId,
      isGroupTask: payload.data?.isGroupTask,
      type: payload.data?.type || 'reminder'
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

  return self.registration.showNotification(notificationTitle, notificationOptions);
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
