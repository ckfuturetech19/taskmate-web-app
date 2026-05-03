import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/apiService';
import { fcmService } from '@/services/fcmService';

interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  isAdmin: boolean;
  proStartDate?: string;
  proEndDate?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
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
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Optionally refresh user profile from server
        refreshProfile();
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      console.log('🔄 Refreshing profile due to external request...');
      refreshProfile();
    };
    
    window.addEventListener('auth-refresh-required', handleRefresh);
    return () => window.removeEventListener('auth-refresh-required', handleRefresh);
  }, []);

  const refreshProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data) {
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Initialize FCM if user is logged in
        if (updatedUser.id) {
          fcmService.initialize().then(() => {
            fcmService.requestPermissionAndSaveToken(updatedUser.id);
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const signInWithGoogle = async () => {
    // Note: Google Sign-in on Web usually needs a redirect or popup that returns a credential
    // which is then sent to our backend. For now, we'll throw an error if not implemented on backend.
    throw new Error('Google Sign-in not yet implemented on backend. Please use Email/Password.');
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Initialize FCM
      fcmService.initialize().then(() => {
        fcmService.requestPermissionAndSaveToken(user.id);
      });
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      throw new Error(error.response?.data?.error || 'Failed to sign in');
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, name });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Initialize FCM
      fcmService.initialize().then(() => {
        fcmService.requestPermissionAndSaveToken(user.id);
      });
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      throw new Error(error.response?.data?.error || 'Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      // Delete FCM token from backend if possible
      if (user) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Error during backend logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
