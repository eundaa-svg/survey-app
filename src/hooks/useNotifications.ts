import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
    markAsRead,
  };
};
