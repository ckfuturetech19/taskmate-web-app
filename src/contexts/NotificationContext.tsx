import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collection, 
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification } from '@/types/task';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Real-time sync for notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const notificationsRef = collection(db, 'users', user.uid, 'notifications');
      
      const unsubscribe = onSnapshot(
        notificationsRef, 
        (snapshot) => {
          try {
            console.log('=== Notifications snapshot received ===');
            console.log('Total notifications:', snapshot.docs.length);
            console.log('Changes:', snapshot.docChanges().map(c => `${c.type}: ${c.doc.id}`));
            
            const fetchedNotifications: Notification[] = snapshot.docs.map(doc => {
              const data = doc.data();
              
              // Convert Firestore Timestamp to ISO string
              let createdAt = new Date().toISOString();
              if (data.createdAt) {
                if (data.createdAt.toDate && typeof data.createdAt.toDate === 'function') {
                  createdAt = data.createdAt.toDate().toISOString();
                } else if (typeof data.createdAt === 'string') {
                  createdAt = data.createdAt;
                }
              }
              
              return {
                id: doc.id,
                ...data,
                createdAt,
              } as Notification;
            });
            
            // Sort by createdAt on client side
            fetchedNotifications.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA; // desc order
            });
            
            console.log('Notifications updated:', fetchedNotifications.length);
            console.log('Unread:', fetchedNotifications.filter(n => !n.isRead).length);
            setNotifications(fetchedNotifications);
          } catch (error) {
            console.error('Error processing notifications:', error);
          }
        },
        (error) => {
          console.error('Error fetching notifications:', error);
          // If orderBy fails, try without it
          console.log('Fetching notifications without orderBy due to error');
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notification => 
          markAsRead(notification.id)
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
