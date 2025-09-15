import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetComponent?: string;
  position?: {x: number; y: number; width: number; height: number};
}

interface GuidedTourProps {
  steps: TourStep[];
  tourKey: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  tourKey,
  onComplete,
  autoStart = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (autoStart) {
      checkTourStatus();
    }
  }, [autoStart, tourKey]);

  const checkTourStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(`tour_${tourKey}_completed`);
      if (!completed) {
        startTour();
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };

  const startTour = () => {
    setCurrentStep(0);
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = async () => {
    try {
      await AsyncStorage.setItem(`tour_${tourKey}_completed`, 'true');
    } catch (error) {
      console.error('Error saving tour completion:', error);
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onComplete?.();
    });
  };

  if (!visible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
        <View style={styles.container}>
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${((currentStep + 1) / steps.length) * 100}%`},
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentStep + 1} of {steps.length}
            </Text>
          </View>

          {/* Tour content */}
          <View style={styles.content}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>

          {/* Navigation buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={skipTour} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip Tour</Text>
            </TouchableOpacity>

            <View style={styles.navigationButtons}>
              {!isFirstStep && (
                <TouchableOpacity onPress={previousStep} style={styles.navButton}>
                  <Icon name="arrow-back" size={20} color="#4A90E2" />
                  <Text style={styles.navButtonText}>Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={nextStep}
                style={[styles.navButton, styles.nextButton]}>
                <Text style={styles.nextButtonText}>
                  {isLastStep ? 'Finish' : 'Next'}
                </Text>
                <Icon
                  name={isLastStep ? 'check' : 'arrow-forward'}
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e1e8ed',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#4A90E2',
  },
  navButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
    marginRight: 4,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default GuidedTour;