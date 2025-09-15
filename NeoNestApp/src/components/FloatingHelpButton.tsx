import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HelpTooltip from './HelpTooltip';
import {useHelp} from '../contexts/HelpContext';

interface FloatingHelpButtonProps {
  screenName: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const FloatingHelpButton: React.FC<FloatingHelpButtonProps> = ({
  screenName,
  position = 'bottom-right',
}) => {
  const {getHelpContent} = useHelp();
  const [scaleValue] = useState(new Animated.Value(1));
  
  const helpContent = getHelpContent(screenName);

  if (!helpContent) {
    return null;
  }

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
    };

    switch (position) {
      case 'bottom-right':
        return {...baseStyle, bottom: 20, right: 20};
      case 'bottom-left':
        return {...baseStyle, bottom: 20, left: 20};
      case 'top-right':
        return {...baseStyle, top: 20, right: 20};
      case 'top-left':
        return {...baseStyle, top: 20, left: 20};
      default:
        return {...baseStyle, bottom: 20, right: 20};
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]}>
      <HelpTooltip content={helpContent}>
        <Animated.View style={[styles.button, {transform: [{scale: scaleValue}]}]}>
          <TouchableOpacity
            style={styles.touchable}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}>
            <Icon name="help-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      </HelpTooltip>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  touchable: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingHelpButton;