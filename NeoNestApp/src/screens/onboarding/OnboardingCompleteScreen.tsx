import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScreenProps, OnboardingStackParamList} from '../../navigation/NavigationTypes';

const OnboardingCompleteScreen: React.FC<ScreenProps<OnboardingStackParamList['Complete']>> = ({
  navigation,
}) => {
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    // Animate the success icon
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboarding_completed', 'true');
      
      // Navigate to auth flow
      // This will be handled by the root navigator checking onboarding status
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth' as never}],
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still proceed to auth
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth' as never}],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.successContainer,
            {
              transform: [{scale: scaleValue}],
            },
          ]}>
          <View style={styles.successIcon}>
            <Icon name="check" size={60} color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, {opacity: fadeValue}]}>
          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.subtitle}>
            Welcome to the Neo-Nest community. Let's start your preterm parenting journey together.
          </Text>

          <View style={styles.nextSteps}>
            <Text style={styles.nextStepsTitle}>What's Next:</Text>
            <View style={styles.step}>
              <Icon name="person-add" size={20} color="#4A90E2" />
              <Text style={styles.stepText}>Create your account</Text>
            </View>
            <View style={styles.step}>
              <Icon name="child-care" size={20} color="#4A90E2" />
              <Text style={styles.stepText}>Set up your baby's profile</Text>
            </View>
            <View style={styles.step}>
              <Icon name="timeline" size={20} color="#4A90E2" />
              <Text style={styles.stepText}>Start tracking milestones</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, {opacity: fadeValue}]}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successContainer: {
    marginBottom: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#27AE60',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  nextSteps: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default OnboardingCompleteScreen;