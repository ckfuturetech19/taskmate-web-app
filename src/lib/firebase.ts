import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';

// Firebase configuration for TaskMate web app
// Only used for FCM (Push Notifications)

const app = initializeApp(firebaseConfig);

console.log('✅ Firebase (FCM) initialized successfully');

export { app };
export default app;
