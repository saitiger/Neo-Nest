import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

export interface NotificationPreferences {
  milestoneReminders: boolean;
  communityReplies: boolean;
  expertSessions: boolean;
  weeklyProgress: boolean;
  reminderTime: string; // HH:MM format
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledDate: Date;
  type: 'milestone' | 'community' | 'expert' | 'progress';
  data?: any;
}

const NOTIFICATION_PREFERENCES_KEY = 'notification_preferences';
const SCHEDULED_NOTIFICATIONS_KEY = 'scheduled_notifications';

const defaultPreferences: NotificationPreferences = {
  milestoneReminders: true,
  communityReplies: true,
  expertSessions: true,
  weeklyProgress: true,
  reminderTime: '09:00',
};

/**
 * Get user's notification preferences
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_PREFERENCES_KEY);
    if (stored) {
      return {...defaultPreferences, ...JSON.parse(stored)};
    }
    return defaultPreferences;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return defaultPreferences;
  }
};

/**
 * Save user's notification preferences
 */
export const saveNotificationPreferences = async (preferences: NotificationPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    throw error;
  }
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    // This would integrate with react-native-push-notification or similar
    // For now, we'll simulate permission request
    console.log('Requesting notification permissions...');
    
    // Store permission status
    await AsyncStorage.setItem('notification_permission', 'granted');
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Check if notifications are enabled
 */
export const areNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const permission = await AsyncStorage.getItem('notification_permission');
    return permission === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a milestone reminder notification
 */
export const scheduleMilestoneReminder = async (
  milestoneId: string,
  milestoneName: string,
  correctedAgeWeeks: number
): Promise<void> => {
  try {
    const preferences = await getNotificationPreferences();
    if (!preferences.milestoneReminders) return;

    const notification: ScheduledNotification = {
      id: `milestone_${milestoneId}_${Date.now()}`,
      title: 'Milestone Check-in',
      body: `Time to check on "${milestoneName}" for your ${correctedAgeWeeks}-week-old baby`,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      type: 'milestone',
      data: {milestoneId, correctedAgeWeeks},
    };

    await scheduleNotification(notification);
  } catch (error) {
    console.error('Error scheduling milestone reminder:', error);
  }
};

/**
 * Schedule a community reply notification
 */
export const scheduleCommunityNotification = async (
  postId: string,
  postTitle: string,
  replyAuthor: string
): Promise<void> => {
  try {
    const preferences = await getNotificationPreferences();
    if (!preferences.communityReplies) return;

    const notification: ScheduledNotification = {
      id: `community_${postId}_${Date.now()}`,
      title: 'New Reply to Your Post',
      body: `${replyAuthor} replied to "${postTitle}"`,
      scheduledDate: new Date(), // Immediate
      type: 'community',
      data: {postId},
    };

    await scheduleNotification(notification);
  } catch (error) {
    console.error('Error scheduling community notification:', error);
  }
};

/**
 * Schedule weekly progress notification
 */
export const scheduleWeeklyProgressNotification = async (
  babyName: string,
  correctedAge: string
): Promise<void> => {
  try {
    const preferences = await getNotificationPreferences();
    if (!preferences.weeklyProgress) return;

    const notification: ScheduledNotification = {
      id: `progress_${Date.now()}`,
      title: 'Weekly Progress Check',
      body: `How is ${babyName} doing this week? (Corrected age: ${correctedAge})`,
      scheduledDate: getNextWeeklyReminderDate(preferences.reminderTime),
      type: 'progress',
      data: {babyName, correctedAge},
    };

    await scheduleNotification(notification);
  } catch (error) {
    console.error('Error scheduling weekly progress notification:', error);
  }
};

/**
 * Schedule expert session notification
 */
export const scheduleExpertSessionNotification = async (
  sessionTitle: string,
  sessionDate: Date
): Promise<void> => {
  try {
    const preferences = await getNotificationPreferences();
    if (!preferences.expertSessions) return;

    const notification: ScheduledNotification = {
      id: `expert_${Date.now()}`,
      title: 'Expert Session Reminder',
      body: `"${sessionTitle}" starts in 1 hour`,
      scheduledDate: new Date(sessionDate.getTime() - 60 * 60 * 1000), // 1 hour before
      type: 'expert',
      data: {sessionTitle, sessionDate},
    };

    await scheduleNotification(notification);
  } catch (error) {
    console.error('Error scheduling expert session notification:', error);
  }
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async (): Promise<ScheduledNotification[]> => {
  try {
    const stored = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    if (stored) {
      const notifications = JSON.parse(stored);
      // Convert date strings back to Date objects
      return notifications.map((n: any) => ({
        ...n,
        scheduledDate: new Date(n.scheduledDate),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    const notifications = await getScheduledNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

// Private helper functions

const scheduleNotification = async (notification: ScheduledNotification): Promise<void> => {
  try {
    const notifications = await getScheduledNotifications();
    notifications.push(notification);
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    
    // In a real implementation, this would schedule with the OS
    console.log('Scheduled notification:', notification.title);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

const getNextWeeklyReminderDate = (reminderTime: string): Date => {
  const [hours, minutes] = reminderTime.split(':').map(Number);
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  nextWeek.setHours(hours, minutes, 0, 0);
  
  return nextWeek;
};

/**
 * Initialize notification system
 */
export const initializeNotifications = async (): Promise<void> => {
  try {
    // Request permissions on app start
    await requestNotificationPermissions();
    
    // Clean up expired notifications
    const notifications = await getScheduledNotifications();
    const now = new Date();
    const active = notifications.filter(n => n.scheduledDate > now);
    
    if (active.length !== notifications.length) {
      await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(active));
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};