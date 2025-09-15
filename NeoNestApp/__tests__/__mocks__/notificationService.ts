export const NotificationService = {
  scheduleNotification: jest.fn().mockResolvedValue(true),
  cancelNotification: jest.fn().mockResolvedValue(true),
  getScheduledNotifications: jest.fn().mockResolvedValue([]),
  updateNotificationPreferences: jest.fn().mockResolvedValue(undefined),
  getNotificationPreferences: jest.fn().mockResolvedValue({
    milestoneReminders: true,
    communityReplies: true,
    expertSessions: true,
  }),
  getStoredNotifications: jest.fn().mockResolvedValue([]),
};