import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { NotificationProvider, useNotification } from '../../src/contexts/NotificationContext';
// Mock the notification service
jest.mock('../../src/utils/notificationService');
import { NotificationService } from '../__mocks__/notificationService';

const TestComponent = () => {
  const { notifications, addNotification, markAsRead, clearNotifications } = useNotification();
  
  return (
    <>
      {notifications.map(notification => (
        <div key={notification.id} testID={`notification-${notification.id}`}>
          {notification.title}
        </div>
      ))}
    </>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide notification context to children', () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Should render without errors
    expect(() => getByTestId('notification-test')).not.toThrow();
  });

  it('should add notifications to the context', async () => {
    let contextValue: any;
    
    const TestComponentWithActions = () => {
      contextValue = useNotification();
      return null;
    };

    render(
      <NotificationProvider>
        <TestComponentWithActions />
      </NotificationProvider>
    );

    await act(async () => {
      contextValue.addNotification({
        id: 'test-1',
        title: 'Test Notification',
        body: 'Test body',
        type: 'milestone',
        timestamp: new Date(),
        read: false,
      });
    });

    expect(contextValue.notifications).toHaveLength(1);
    expect(contextValue.notifications[0].title).toBe('Test Notification');
  });

  it('should mark notifications as read', async () => {
    let contextValue: any;
    
    const TestComponentWithActions = () => {
      contextValue = useNotification();
      return null;
    };

    render(
      <NotificationProvider>
        <TestComponentWithActions />
      </NotificationProvider>
    );

    // Add a notification first
    await act(async () => {
      contextValue.addNotification({
        id: 'test-1',
        title: 'Test Notification',
        body: 'Test body',
        type: 'milestone',
        timestamp: new Date(),
        read: false,
      });
    });

    // Mark as read
    await act(async () => {
      contextValue.markAsRead('test-1');
    });

    expect(contextValue.notifications[0].read).toBe(true);
  });

  it('should clear all notifications', async () => {
    let contextValue: any;
    
    const TestComponentWithActions = () => {
      contextValue = useNotification();
      return null;
    };

    render(
      <NotificationProvider>
        <TestComponentWithActions />
      </NotificationProvider>
    );

    // Add notifications
    await act(async () => {
      contextValue.addNotification({
        id: 'test-1',
        title: 'Test Notification 1',
        body: 'Test body 1',
        type: 'milestone',
        timestamp: new Date(),
        read: false,
      });
      contextValue.addNotification({
        id: 'test-2',
        title: 'Test Notification 2',
        body: 'Test body 2',
        type: 'community',
        timestamp: new Date(),
        read: false,
      });
    });

    expect(contextValue.notifications).toHaveLength(2);

    // Clear notifications
    await act(async () => {
      contextValue.clearNotifications();
    });

    expect(contextValue.notifications).toHaveLength(0);
  });

  it('should load notifications on mount', async () => {
    const mockNotifications = [
      {
        id: 'test-1',
        title: 'Loaded Notification',
        body: 'Test body',
        type: 'milestone',
        timestamp: new Date().toISOString(),
        read: false,
      }
    ];

    (NotificationService.getStoredNotifications as jest.Mock).mockResolvedValue(mockNotifications);

    let contextValue: any;
    
    const TestComponentWithActions = () => {
      contextValue = useNotification();
      return null;
    };

    render(
      <NotificationProvider>
        <TestComponentWithActions />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(contextValue.notifications).toHaveLength(1);
      expect(contextValue.notifications[0].title).toBe('Loaded Notification');
    });
  });
});