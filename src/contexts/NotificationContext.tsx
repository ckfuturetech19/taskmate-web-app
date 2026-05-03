import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Notification } from '@/types/task';
import { useAuth } from './AuthContext';
import api from '@/services/apiService';
import { pusherService } from '@/services/pusherService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
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

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get('/notifications');
      const data = response.data;
      
      const fetchedNotifications: Notification[] = data.map((n: any) => ({
        ...n,
        isRead: n.read, // Map 'read' from backend to 'isRead' used in frontend
        createdAt: n.timestamp, // Map 'timestamp' to 'createdAt'
      }));
      
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    // Setup Pusher real-time notifications
    const channel = pusherService.subscribeToUser(user.id);
    
    channel.bind('notification-received', (data: any) => {
      console.log('🔔 New notification received via Pusher:', data);
      setNotifications(prev => [
        {
          ...data,
          isRead: data.read || false,
          createdAt: data.timestamp || new Date().toISOString(),
        },
        ...prev
      ]);
    });

    channel.bind('pro-status-changed', (data: any) => {
      console.log('💎 Pro status changed via Pusher:', data);
      // Trigger a profile refresh in AuthContext
      // Note: Since we don't have direct access to refreshProfile here,
      // we can use a window event or just wait for the user to navigate.
      // But a better way is to handle this in AuthContext or a common parent.
      // For now, I'll just reload the page or show a toast.
      window.dispatchEvent(new CustomEvent('auth-refresh-required'));
    });

    return () => {
      channel.unbind('notification-received');
      channel.unbind('pro-status-changed');
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
      refreshNotifications: fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
