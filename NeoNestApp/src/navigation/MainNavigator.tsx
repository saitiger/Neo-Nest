import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import MilestonesScreen from '../screens/MilestonesScreen';
import MilestoneDetailScreen from '../screens/MilestoneDetailScreen';
import BabyProfileScreen from '../screens/BabyProfileScreen';
import CommunityScreen from '../screens/CommunityScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import {useAuth} from '../contexts/AuthContext';

export type MainTabParamList = {
  Home: undefined;
  Milestones: undefined;
  Community: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  BabyProfile: undefined;
  MilestoneDetail: {
    milestone: any;
    currentStatus: string;
  };
  PostDetail: {
    postId: string;
  };
  CommunityGroups: undefined;
  GroupDetail: {
    groupId: string;
  };
  CreatePost: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

// Placeholder Community Screens
const CommunityGroupsScreen: React.FC = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 16}}>Community Groups</Text>
      <Text style={{color: '#666'}}>This screen is coming soon!</Text>
    </View>
  );
};

const GroupDetailScreen: React.FC<{route: any}> = ({route}) => {
  const {groupId} = route.params;
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 16}}>Group Detail</Text>
      <Text style={{color: '#666'}}>Group ID: {groupId}</Text>
      <Text style={{color: '#666', marginTop: 8}}>This screen is coming soon!</Text>
    </View>
  );
};

// Temporary Profile Screen component
const ProfileScreen: React.FC = () => {
  const {user, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f8f9fa',
    }}>
      <View style={{alignItems: 'center', marginBottom: 40}}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#3498db',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Icon name="person" size={40} color="#ffffff" />
        </View>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4}}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={{fontSize: 16, color: '#7f8c8d'}}>
          {user?.email}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#e74c3c',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
        onPress={handleLogout}>
        <Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id="MainTabNavigator"
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Milestones':
              iconName = 'timeline';
              break;
            case 'Community':
              iconName = 'forum';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e1e8ed',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomColor: '#e1e8ed',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#2c3e50',
        },
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'Neo-Nest',
        }}
      />
      <Tab.Screen 
        name="Milestones" 
        component={MilestonesScreen}
        options={{
          title: 'Milestones',
          headerTitle: 'Milestone Tracker',
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{
          title: 'Community',
          headerTitle: 'Community Forum',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id="MainStackNavigator"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="BabyProfile" 
        component={BabyProfileScreen}
        options={{
          headerShown: true,
          title: 'Baby Profile',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="MilestoneDetail" 
        component={MilestoneDetailScreen}
        options={{
          headerShown: true,
          title: 'Milestone Details',
        }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{
          headerShown: true,
          title: 'Post Details',
        }}
      />
      <Stack.Screen 
        name="CommunityGroups" 
        component={CommunityGroupsScreen}
        options={{
          headerShown: true,
          title: 'Community Groups',
        }}
      />
      <Stack.Screen 
        name="GroupDetail" 
        component={GroupDetailScreen}
        options={{
          headerShown: true,
          title: 'Group Details',
        }}
      />
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen}
        options={{
          headerShown: true,
          title: 'Create Post',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;