import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScreenProps, OnboardingStackParamList} from '../../navigation/NavigationTypes';

interface Permission {
  id: string;
  icon: string;
  title: string;
  description: string;
  required: boolean;
  granted: boolean;
}

const PermissionsScreen: React.FC<ScreenProps<OnboardingStackParamList['Permissions']>> = ({
  navigation,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'notifications',
      icon: 'notifications',
      title: 'Push Notifications',
      description: 'Get reminders for milestone tracking and community updates',
      required: false,
      granted: false,
    },
    {
      id: 'storage',
      icon: 'storage',
      title: 'Local Storage',
      description: 'Store your baby\'s profile and milestone data securely on your device',
      required: true,
      granted: false,
    },
  ]);

  const handlePermissionRequest = async (permissionId: string) => {
    // Simulate permission request
    const updatedPermissions = permissions.map(permission => {
      if (permission.id === permissionId) {
        return {...permission, granted: true};
      }
      return permission;
    });
    setPermissions(updatedPermissions);

    // Show success feedback
    Alert.alert('Permission Granted', 'Thank you for allowing this permission.');
  };

  const handleContinue = () => {
    const requiredPermissions = permissions.filter(p => p.required);
    const grantedRequired = requiredPermissions.filter(p => p.granted);

    if (grantedRequired.length < requiredPermissions.length) {
      Alert.alert(
        'Required Permissions',
        'Some required permissions are needed for the app to function properly.',
        [
          {text: 'OK', style: 'default'},
        ]
      );
      return;
    }

    navigation.navigate('Complete');
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Permissions',
      'You can always enable these permissions later in your device settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Skip', style: 'default', onPress: () => navigation.navigate('Complete')},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Icon name="security" size={60} color="#4A90E2" />
          <Text style={styles.title}>App Permissions</Text>
          <Text style={styles.subtitle}>
            Neo-Nest needs a few permissions to provide the best experience for you and your baby.
          </Text>
        </View>

        <View style={styles.permissionsList}>
          {permissions.map((permission) => (
            <View key={permission.id} style={styles.permissionItem}>
              <View style={styles.permissionIcon}>
                <Icon 
                  name={permission.icon} 
                  size={24} 
                  color={permission.granted ? '#27AE60' : '#7f8c8d'} 
                />
              </View>
              <View style={styles.permissionContent}>
                <View style={styles.permissionHeader}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  {permission.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.permissionDescription}>{permission.description}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.permissionButton,
                  permission.granted && styles.permissionButtonGranted,
                ]}
                onPress={() => handlePermissionRequest(permission.id)}
                disabled={permission.granted}>
                <Icon 
                  name={permission.granted ? 'check' : 'arrow-forward'} 
                  size={20} 
                  color={permission.granted ? '#27AE60' : '#ffffff'} 
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionsList: {
    flex: 1,
  },
  permissionItem: {
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
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionContent: {
    flex: 1,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  requiredText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  permissionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  permissionButtonGranted: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#27AE60',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default PermissionsScreen;