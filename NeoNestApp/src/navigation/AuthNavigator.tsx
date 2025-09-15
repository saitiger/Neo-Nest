import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeAuthScreen from '../screens/auth/WelcomeAuthScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import {AuthStackParamList} from './NavigationTypes';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#f8f9fa'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeAuthScreen}
        options={{
          gestureEnabled: false, // Prevent swiping back from welcome
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;