import React, {useState, useEffect} from 'react';
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
import {useBabyProfile} from '../contexts/BabyProfileContext';
import {useNotification} from '../contexts/NotificationContext';
import CorrectedAgeDisplay from '../components/CorrectedAgeDisplay';
import HelpTooltip from '../components/HelpTooltip';
import GuidedTour from '../components/GuidedTour';
import NotificationBadge from '../components/NotificationBadge';
import NotificationCenter from '../components/NotificationCenter';
import {MainTabParamList, MainStackParamList} from './NavigationTypes';

// Enhanced Notifications Screen
const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {preferences, updatePreferences, isLoading} = useNotification();
  
  const togglePreference = async (key: string) => {
    if (!preferences) return;
    
    try {
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key as keyof typeof preferences],
      };
      await updatePreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };
  
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
      
      {isLoading || !preferences ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#7f8c8d'}}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={{flex: 1, padding: 20}}>
          <View style={{backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16}}>
            <Text style={{fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 16}}>
              Notification Preferences
            </Text>
            
            {[
              {key: 'milestoneReminders', label: 'Milestone Reminders', description: 'Get reminded to check milestone progress'},
              {key: 'communityReplies', label: 'Community Replies', description: 'Notifications when someone replies to your posts'},
              {key: 'expertSessions', label: 'Expert Sessions', description: 'Reminders for upcoming expert Q&A sessions'},
              {key: 'weeklyProgress', label: 'Weekly Progress', description: 'Weekly check-ins on your baby\'s development'},
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f1f3f4',
                }}
                onPress={() => togglePreference(item.key)}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 16, fontWeight: '500', color: '#2c3e50', marginBottom: 2}}>
                    {item.label}
                  </Text>
                  <Text style={{fontSize: 14, color: '#7f8c8d'}}>
                    {item.description}
                  </Text>
                </View>
                <View style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: preferences[item.key] ? '#4A90E2' : '#e1e8ed',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}>
                  <View style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: '#ffffff',
                    alignSelf: preferences[item.key] ? 'flex-end' : 'flex-start',
                  }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
  const {primaryProfile} = useBabyProfile();
  const {getUnreadCount} = useNotification();
  const [showTour, setShowTour] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  useEffect(() => {
    // Auto-start tour when user first enters main app
    const timer = setTimeout(() => {
      setShowTour(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const correctedAgeTooltip = {
    title: 'Corrected Age',
    description: 'For preterm babies, corrected age accounts for early birth by subtracting the weeks born early from chronological age. This helps track development more accurately.',
    tips: [
      'Corrected age is used until your baby is 2 years old',
      'Milestones are based on corrected age, not actual age',
      'Share corrected age information with your healthcare providers',
    ],
  };

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Neo-Nest!',
      description: 'Let\'s take a quick tour of the main features to help you get started.',
    },
    {
      id: 'corrected-age',
      title: 'Corrected Age Display',
      description: 'Your baby\'s corrected age is shown here. This is crucial for tracking preterm development milestones.',
    },
    {
      id: 'home-tab',
      title: 'Home Dashboard',
      description: 'Your personalized dashboard shows recent milestones, upcoming reminders, and quick actions.',
    },
    {
      id: 'milestones-tab',
      title: 'Milestone Tracker',
      description: 'Track your baby\'s developmental milestones using corrected age ranges designed for preterm babies.',
    },
    {
      id: 'community-tab',
      title: 'Community Support',
      description: 'Connect with other NICU parents and get advice from healthcare professionals.',
    },
    {
      id: 'profile-tab',
      title: 'Profile & Settings',
      description: 'Manage your baby\'s profile, notification preferences, and access help resources.',
    },
  ];

  return (
    <>
      <Tab.Navigator
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
            height: primaryProfile ? 80 : 60, // Extra height for corrected age display
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: primaryProfile ? 16 : 4, // Adjust for corrected age display
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
          headerRight: () => (
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
              {primaryProfile && (
                <HelpTooltip content={correctedAgeTooltip}>
                  <CorrectedAgeDisplay compact showTooltip />
                </HelpTooltip>
              )}
              <TouchableOpacity
                onPress={() => setShowNotificationCenter(true)}
                style={{marginLeft: 12, position: 'relative'}}>
                <Icon name="notifications" size={24} color="#7f8c8d" />
                <NotificationBadge count={getUnreadCount()} size="small" />
              </TouchableOpacity>
            </View>
          ),
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

      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        tourKey="main_navigation"
        autoStart={showTour}
        onComplete={() => setShowTour(false)}
      />

      {/* Notification Center */}
      <NotificationCenter
        visible={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onNotificationPress={(notification) => {
          // Handle notification press - navigate to relevant screen
          console.log('Notification pressed:', notification);
        }}
      />
    </>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
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