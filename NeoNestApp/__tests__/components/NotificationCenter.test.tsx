import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationCenter from '../../src/components/NotificationCenter';
import { NotificationProvider } from '../../src/contexts/NotificationContext';

const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Milestone Reminder',
    body: 'Time to check for new milestones',
    type: 'milestone' as const,
    timestamp: new Date('2024-12-15T10:00:00Z'),
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Community Reply',
    body: 'Someone replied to your post',
    type: 'community' as const,
    timestamp: new Date('2024-12-15T09:00:00Z'),
    read: true,
  },
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>
    {children}
  </NotificationProvider>
);

describe('NotificationCenter Component', () => {
  it('should render notification list correctly', () => {
    const { getByText } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('Milestone Reminder')).toBeTruthy();
    expect(getByText('Community Reply')).toBeTruthy();
  });

  it('should show unread indicator for unread notifications', () => {
    const { getByTestId } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    expect(getByTestId('unread-indicator-notif-1')).toBeTruthy();
  });

  it('should call onNotificationPress when notification is tapped', () => {
    const mockOnPress = jest.fn();
    
    const { getByTestId } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        onNotificationPress={mockOnPress}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    fireEvent.press(getByTestId('notification-item-notif-1'));
    
    expect(mockOnPress).toHaveBeenCalledWith(mockNotifications[0]);
  });

  it('should call onMarkAsRead when mark as read is tapped', () => {
    const mockMarkAsRead = jest.fn();
    
    const { getByTestId } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        onNotificationPress={jest.fn()}
        onMarkAsRead={mockMarkAsRead}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    fireEvent.press(getByTestId('mark-read-button-notif-1'));
    
    expect(mockMarkAsRead).toHaveBeenCalledWith('notif-1');
  });

  it('should call onClearAll when clear all button is pressed', () => {
    const mockClearAll = jest.fn();
    
    const { getByTestId } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={mockClearAll}
      />,
      { wrapper: TestWrapper }
    );
    
    fireEvent.press(getByTestId('clear-all-button'));
    
    expect(mockClearAll).toHaveBeenCalled();
  });

  it('should show empty state when no notifications', () => {
    const { getByText } = render(
      <NotificationCenter 
        notifications={[]}
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    expect(getByText('No notifications')).toBeTruthy();
  });

  it('should filter notifications by type', () => {
    const { getByTestId, queryByText } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        filterType="milestone"
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    expect(queryByText('Milestone Reminder')).toBeTruthy();
    expect(queryByText('Community Reply')).toBeFalsy();
  });

  it('should show notification timestamp correctly', () => {
    const { getByText } = render(
      <NotificationCenter 
        notifications={mockNotifications}
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    // Should show relative time
    expect(getByText(/ago/)).toBeTruthy();
  });

  it('should handle long notification lists with scrolling', () => {
    const longNotificationList = Array.from({ length: 50 }, (_, index) => ({
      id: `notif-${index}`,
      title: `Notification ${index}`,
      body: `Body ${index}`,
      type: 'milestone' as const,
      timestamp: new Date(),
      read: false,
    }));

    const { getByTestId } = render(
      <NotificationCenter 
        notifications={longNotificationList}
        onNotificationPress={jest.fn()}
        onMarkAsRead={jest.fn()}
        onClearAll={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );
    
    expect(getByTestId('notification-scroll-view')).toBeTruthy();
  });
});