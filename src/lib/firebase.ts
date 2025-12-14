import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for TaskMate web app
// Using the same Firebase project as the mobile app for real-time sync
const firebaseConfig = {
  apiKey: "AIzaSyBU1on-3Dn33IsUfdoHYi3kluC63FIA2bs",
  authDomain: "taskmate-e7cc9.firebaseapp.com",
  projectId: "taskmate-e7cc9",
  storageBucket: "taskmate-e7cc9.firebasestorage.app",
  messagingSenderId: "425325230785",
  appId: "1:425325230785:web:5471398c240d7d8d46b240",
  measurementId: "G-0921EG4E7W"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Configure Google Auth Provider with better settings
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    // Add these parameters to help with popup issues
    display: 'popup',
  });
  
  // Add scopes if needed
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
  
  console.log('✅ Firebase initialized successfully');
  console.log('📍 Auth Domain:', firebaseConfig.authDomain);
  console.log('🌐 Current Origin:', window.location.origin);
  console.log('💡 Make sure this domain is authorized in Firebase Console > Authentication > Settings > Authorized domains');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { app, auth, db, googleProvider };
export default app;
