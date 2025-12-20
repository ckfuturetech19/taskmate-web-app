// Firebase configuration that can be used by both the main app and service worker
// This file exports the config so it can be imported in different contexts

export const getFirebaseConfig = () => {
  // Try to get from environment variables first (for Vite)
  // Check if import.meta is available (Vite environment)
  const hasImportMeta = typeof import.meta !== 'undefined';
  
  const config = {
    apiKey: hasImportMeta && import.meta.env?.VITE_FIREBASE_API_KEY
      ? import.meta.env.VITE_FIREBASE_API_KEY
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.apiKey)
      ? (window as any).__FIREBASE_CONFIG__.apiKey
      : "AIzaSyBU1on-3Dn33IsUfdoHYi3kluC63FIA2bs",
    
    authDomain: hasImportMeta && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN
      ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.authDomain)
      ? (window as any).__FIREBASE_CONFIG__.authDomain
      : "taskmate-e7cc9.firebaseapp.com",
    
    projectId: hasImportMeta && import.meta.env?.VITE_FIREBASE_PROJECT_ID
      ? import.meta.env.VITE_FIREBASE_PROJECT_ID
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.projectId)
      ? (window as any).__FIREBASE_CONFIG__.projectId
      : "taskmate-e7cc9",
    
    storageBucket: hasImportMeta && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET
      ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.storageBucket)
      ? (window as any).__FIREBASE_CONFIG__.storageBucket
      : "taskmate-e7cc9.firebasestorage.app",
    
    messagingSenderId: hasImportMeta && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID
      ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.messagingSenderId)
      ? (window as any).__FIREBASE_CONFIG__.messagingSenderId
      : "425325230785",
    
    appId: hasImportMeta && import.meta.env?.VITE_FIREBASE_APP_ID
      ? import.meta.env.VITE_FIREBASE_APP_ID
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.appId)
      ? (window as any).__FIREBASE_CONFIG__.appId
      : "1:425325230785:web:5471398c240d7d8d46b240",
    
    measurementId: hasImportMeta && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID
      ? import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      : (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__?.measurementId)
      ? (window as any).__FIREBASE_CONFIG__.measurementId
      : "G-0921EG4E7W"
  };
  
  return config;
};

// Export a constant for direct use
export const firebaseConfig = getFirebaseConfig();

