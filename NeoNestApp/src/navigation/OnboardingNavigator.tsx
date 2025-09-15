import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import FeaturesScreen from '../screens/onboarding/FeaturesScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';
import {OnboardingStackParamList} from './NavigationTypes';

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#f8f9fa'},
        gestureEnabled: false, // Prevent swiping back during onboarding
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Features" component={FeaturesScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Complete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;