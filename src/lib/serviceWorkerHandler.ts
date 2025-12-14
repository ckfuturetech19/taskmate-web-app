import { auth } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Initialize service worker message handler
export const initializeServiceWorkerHandler = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async (event) => {
      console.log('Service worker message received:', event.data);

      if (event.data.type === 'GET_AUTH_TOKEN') {
        const action = event.data.action;
        const { taskId, userId, isGroupTask, groupId, snoozeMinutes } = event.data;

        try {
          // Get current user auth token
          const currentUser = auth.currentUser;
          if (!currentUser) {
            event.ports[0].postMessage({ success: false, error: 'Not authenticated' });
            return;
          }

          const token = await currentUser.getIdToken();

          if (action === 'complete') {
            // Call cloud function to mark task as complete
            const markComplete = httpsCallable(functions, 'markTaskComplete');
            const result = await markComplete({
              taskId,
              userId,
              isGroupTask,
              groupId,
            });

            event.ports[0].postMessage({ success: true, result: result.data });
          } else if (action === 'snooze') {
            // Call cloud function to snooze reminder
            const snoozeReminder = httpsCallable(functions, 'snoozeTaskReminder');
            const result = await snoozeReminder({
              taskId,
              userId,
              isGroupTask,
              groupId,
              snoozeMinutes: snoozeMinutes || 10,
            });

            event.ports[0].postMessage({ success: true, result: result.data });
          }
        } catch (error) {
          console.error('Error handling service worker message:', error);
          event.ports[0].postMessage({ success: false, error: error.message });
        }
      }
    });

    console.log('Service worker message handler initialized');
  }
};
