import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {
  NotificationPreferences,
  ScheduledNotification,
  getNotificationPreferences,
  saveNotificationPreferences,
  getScheduledNotifications,
  scheduleMilestoneReminder,
  scheduleCommunityNotification,
  scheduleWeeklyProgressNotification,
  scheduleExpertSessionNotification,
  initializeNotifications,
  areNotificationsEnabled,
} from '../utils/notificationService';

interface NotificationContextType {
  preferences: NotificationPreferences | null;
  notifications: ScheduledNotification[];
  isEnabled: boolean;
  isLoading: boolean;
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>;
  scheduleReminder: (type: 'milestone' | 'community' | 'expert' | 'progress', data: any) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  getUnreadCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({children}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [notifications, setNotifications] = useState<ScheduledNotification[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeNotificationSystem();
  }, []);

  const initializeNotificationSystem = async () => {
    try {
      setIsLoading(true);
      
      // Initialize the notification system
      await initializeNotifications();
      
      // Load preferences and notifications
      const [prefs, scheduled, enabled] = await Promise.all([
        getNotificationPreferences(),
        getScheduledNotifications(),
        areNotificationsEnabled(),
      ]);
      
      setPreferences(prefs);
      setNotifications(scheduled);
      setIsEnabled(enabled);
    } catch (error) {
      console.error('Error initializing notification system:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await saveNotificationPreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const scheduleReminder = async (type: 'milestone' | 'community' | 'expert' | 'progress', data: any) => {
    try {
      switch (type) {
        case 'milestone':
          await scheduleMilestoneReminder(data.milestoneId, data.milestoneName, data.correctedAgeWeeks);
          break;
        case 'community':
          await scheduleCommunityNotification(data.postId, data.postTitle, data.replyAuthor);
          break;
        case 'expert':
          await scheduleExpertSessionNotification(data.sessionTitle, data.sessionDate);
          break;
        case 'progress':
          await scheduleWeeklyProgressNotification(data.babyName, data.correctedAge);
          break;
      }
      
      // Refresh notifications after scheduling
      await refreshNotifications();
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  };

  const refreshNotifications = async () => {
    try {
      const scheduled = await getScheduledNotifications();
      setNotifications(scheduled);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  };

  const getUnreadCount = (): number => {
    const now = new Date();
    return notifications.filter(n => n.scheduledDate <= now).length;
  };

  const value: NotificationContextType = {
    preferences,
    notifications,
    isEnabled,
    isLoading,
    updatePreferences,
    scheduleReminder,
    refreshNotifications,
    getUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};