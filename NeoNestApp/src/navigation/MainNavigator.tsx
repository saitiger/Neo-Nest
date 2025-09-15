import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import MilestonesScreen from '../screens/MilestonesScreen';
import MilestoneDetailScreen from '../screens/MilestoneDetailScreen';
import BabyProfileScreen from '../screens/BabyProfileScreen';
import CommunityScreen from '../screens/CommunityScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from '../screens/HelpScreen';
import AboutScreen from '../screens/AboutScreen';
import {useAuth} from '../contexts/AuthContext';
import {MainTabParamList, MainStackParamList} from './NavigationTypes';

// Placeholder Notifications Screen
const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  return (
    <View style={{flex: 1, backgroundColor: '#f8f9fa'}}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
      }}>
        <TouchableOpacity
          style={{padding: 8}}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontWeight: '600', color: '#2c3e50'}}>
          Notifications
        </Text>
        <View style={{width: 40}} />
      </View>
      
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Icon name="notifications" size={60} color="#4A90E2" />
        <Text style={{fontSize: 18, fontWeight: '600', color: '#2c3e50', marginTop: 16, marginBottom: 8}}>
          Notification Settings
        </Text>
        <Text style={{fontSize: 16, color: '#7f8c8d', textAlign: 'center'}}>
          Manage your notification preferences and stay updated with milestone reminders and community activity.
        </Text>
      </View>
    </View>
  );
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

// Enhanced Profile Screen component
const ProfileScreen: React.FC = () => {
  const {user} = useAuth();
  const navigation = useNavigation();

  const profileOptions = [
    {
      id: 'baby-profile',
      title: 'Baby Profile',
      subtitle: 'Manage your baby\'s information',
      icon: 'child-care',
      onPress: () => navigation.navigate('BabyProfile' as never),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: 'notifications',
      onPress: () => navigation.navigate('Notifications' as never),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and account settings',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help',
      onPress: () => navigation.navigate('Help' as never),
    },
  ];

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#f8f9fa'}}>
      <View style={{
        backgroundColor: '#4A90E2',
        paddingHorizontal: 20,
        paddingVertical: 40,
        alignItems: 'center',
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Icon name="person" size={40} color="#4A90E2" />
        </View>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4}}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={{fontSize: 16, color: '#ffffff', opacity: 0.9}}>
          {user?.email}
        </Text>
      </View>

      <View style={{padding: 20}}>
        {profileOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={option.onPress}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#f8f9fa',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Icon name={option.icon} size={20} color="#4A90E2" />
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 2}}>
                {option.title}
              </Text>
              <Text style={{fontSize: 14, color: '#7f8c8d'}}>
                {option.subtitle}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#7f8c8d" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;