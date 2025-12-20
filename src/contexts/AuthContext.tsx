import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { fcmService } from '@/services/fcmService';
import { oneSignalService } from '@/services/oneSignalService';
import { formatFirebaseError } from '@/lib/authErrors';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });

          // Initialize OneSignal and save Player ID
          try {
            await oneSignalService.initialize();
            await oneSignalService.requestPermissionAndSavePlayerId(firebaseUser.uid);
          } catch (error) {
            console.error('Error setting up OneSignal:', error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Check for redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect sign-in successful');
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        // Show error to user if needed
      }
    };
    
    checkRedirectResult();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Try popup first
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // If popup is blocked, try redirect as fallback
      if (error.code === 'auth/popup-blocked') {
        try {
          console.log('Popup blocked, trying redirect...');
          await signInWithRedirect(auth, googleProvider);
          return; // Redirect will reload the page
        } catch (redirectError: any) {
          console.error('Redirect also failed:', redirectError);
          throw new Error('Unable to sign in. Please allow pop-ups for this site or try a different browser.');
        }
      }
      
      throw new Error(formatFirebaseError(error));
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      throw new Error(formatFirebaseError(error));
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user && displayName) {
        await updateProfile(result.user, { displayName });
      }
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      throw new Error(formatFirebaseError(error));
    }
  };

  const signOut = async () => {
    try {
      // Delete FCM token before signing out
      if (user) {
        await fcmService.deleteToken(user.uid);
      }
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw new Error(formatFirebaseError(error));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
