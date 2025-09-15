import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getScheduledNotifications,
  cancelNotification,
  clearAllNotifications,
  ScheduledNotification,
} from '../utils/notificationService';

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
  onNotificationPress?: (notification: ScheduledNotification) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  visible,
  onClose,
  onNotificationPress,
}) => {
  const [notifications, setNotifications] = useState<ScheduledNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const scheduled = await getScheduledNotifications();
      // Sort by scheduled date, most recent first
      const sorted = scheduled.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
      setNotifications(sorted);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = (notification: ScheduledNotification) => {
    onNotificationPress?.(notification);
    onClose();
  };

  const handleCancelNotification = async (notificationId: string) => {
    try {
      await cancelNotification(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error canceling notification:', error);
      Alert.alert('Error', 'Failed to cancel notification');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all scheduled notifications?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllNotifications();
              await loadNotifications();
            } catch (error) {
              console.error('Error clearing notifications:', error);
              Alert.alert('Error', 'Failed to clear notifications');
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'timeline';
      case 'community':
        return 'forum';
      case 'expert':
        return 'school';
      case 'progress':
        return 'trending-up';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return '#4A90E2';
      case 'community':
        return '#E74C3C';
      case 'expert':
        return '#F39C12';
      case 'progress':
        return '#27AE60';
      default:
        return '#7f8c8d';
    }
  };

  const formatScheduledDate = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays < 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.headerActions}>
            {notifications.length > 0 && (
              <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-none" size={64} color="#bdc3c7" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyDescription}>
              You'll see milestone reminders and community updates here
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationItem}
                onPress={() => handleNotificationPress(notification)}>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <View style={[
                      styles.notificationIcon,
                      {backgroundColor: getNotificationColor(notification.type)}
                    ]}>
                      <Icon
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.notificationText}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationBody}>
                        {notification.body}
                      </Text>
                      <Text style={styles.notificationDate}>
                        {formatScheduledDate(notification.scheduledDate)}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleCancelNotification(notification.id)}
                  style={styles.cancelButton}>
                  <Icon name="close" size={16} color="#7f8c8d" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '500',
  },
  cancelButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default NotificationCenter;