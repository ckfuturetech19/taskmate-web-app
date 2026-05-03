import api from '@/services/apiService';

// Initialize service worker message handler
export const initializeServiceWorkerHandler = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async (event) => {
      console.log('Service worker message received:', event.data);

      if (event.data.type === 'GET_AUTH_TOKEN') {
        const action = event.data.action;
        const { taskId, userId, isGroupTask, groupId, snoozeMinutes } = event.data;

        try {
          // Get token from localStorage since we are in the main thread
          const token = localStorage.getItem('token');
          if (!token) {
            event.ports[0].postMessage({ success: false, error: 'Not authenticated' });
            return;
          }

          if (action === 'complete') {
            // Call API to mark task as complete
            const response = await api.put(`/tasks/${taskId}`, { isCompleted: true });
            event.ports[0].postMessage({ success: true, result: response.data });
          } else if (action === 'snooze') {
            // Call API to snooze reminder
            const response = await api.put(`/tasks/${taskId}/snooze`, { 
              minutes: snoozeMinutes || 10 
            });
            event.ports[0].postMessage({ success: true, result: response.data });
          }
        } catch (error: any) {
          console.error('Error handling service worker message:', error);
          event.ports[0].postMessage({ success: false, error: error.message });
        }
      }
    });

    console.log('Service worker message handler initialized');
  }
};
