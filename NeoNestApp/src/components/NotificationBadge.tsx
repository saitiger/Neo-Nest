import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'medium',
  color = '#E74C3C',
}) => {
  if (count <= 0) {
    return null;
  }

  const displayCount = count > 99 ? '99+' : count.toString();
  
  const sizeStyles = {
    small: {
      width: 16,
      height: 16,
      borderRadius: 8,
      fontSize: 10,
    },
    medium: {
      width: 20,
      height: 20,
      borderRadius: 10,
      fontSize: 12,
    },
    large: {
      width: 24,
      height: 24,
      borderRadius: 12,
      fontSize: 14,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[
      styles.badge,
      {
        width: currentSize.width,
        height: currentSize.height,
        borderRadius: currentSize.borderRadius,
        backgroundColor: color,
      }
    ]}>
      <Text style={[
        styles.badgeText,
        {fontSize: currentSize.fontSize}
      ]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    zIndex: 1,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationBadge;