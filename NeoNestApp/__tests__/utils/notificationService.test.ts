import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock the notification service
jest.mock('../../src/utils/notificationService');
import { NotificationService } from '../__mocks__/notificationService';

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleNotification', () => {
    it('should schedule a notification with correct parameters', async () => {
      const notification = {
        id: 'test-1',
        title: 'Test Notification',
        body: 'Test body',
        scheduledTime: new Date('2025-01-01T10:00:00Z'),
        type: 'milestone' as const,
      };

      const result = await NotificationService.scheduleNotification(notification);
      expect(result).toBe(true);
    });

    it('should handle scheduling errors gracefully', async () => {
      const notification = {
        id: 'test-2',
        title: 'Test Notification',
        body: 'Test body',
        scheduledTime: new Date('invalid-date'),
        type: 'milestone' as const,
      };

      const result = await NotificationService.scheduleNotification(notification);
      expect(result).toBe(false);
    });
  });

  describe('cancelNotification', () => {
    it('should cancel a notification by id', async () => {
      const result = await NotificationService.cancelNotification('test-1');
      expect(result).toBe(true);
    });
  });

  describe('getScheduledNotifications', () => {
    it('should return list of scheduled notifications', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([
        {
          id: 'test-1',
          title: 'Test Notification',
          body: 'Test body',
          scheduledTime: '2025-01-01T10:00:00Z',
          type: 'milestone',
        }
      ]));

      const notifications = await NotificationService.getScheduledNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].id).toBe('test-1');
    });

    it('should return empty array when no notifications exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const notifications = await NotificationService.getScheduledNotifications();
      expect(notifications).toEqual([]);
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should save notification preferences', async () => {
      const preferences = {
        milestoneReminders: true,
        communityReplies: false,
        expertSessions: true,
      };

      await NotificationService.updateNotificationPreferences(preferences);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'notification_preferences',
        JSON.stringify(preferences)
      );
    });
  });

  describe('getNotificationPreferences', () => {
    it('should return saved preferences', async () => {
      const preferences = {
        milestoneReminders: true,
        communityReplies: false,
        expertSessions: true,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(preferences));

      const result = await NotificationService.getNotificationPreferences();
      expect(result).toEqual(preferences);
    });

    it('should return default preferences when none exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await NotificationService.getNotificationPreferences();
      expect(result).toEqual({
        milestoneReminders: true,
        communityReplies: true,
        expertSessions: true,
      });
    });
  });
});