import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScreenProps, MainStackParamList} from '../navigation/NavigationTypes';

const AboutScreen: React.FC<ScreenProps<MainStackParamList['About']>> = ({
  navigation,
}) => {
  const appVersion = '1.0.0';
  const buildNumber = '100';

  const handleOpenWebsite = () => {
    Linking.openURL('https://neo-nest.com');
  };

  const handleOpenPrivacy = () => {
    Linking.openURL('https://neo-nest.com/privacy');
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://neo-nest.com/terms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Neo-Nest</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Icon name="child-care" size={60} color="#ffffff" />
          </View>
          <Text style={styles.appName}>Neo-Nest</Text>
          <Text style={styles.appTagline}>Supporting Preterm Families</Text>
          <Text style={styles.versionText}>Version {appVersion} ({buildNumber})</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            Neo-Nest is dedicated to supporting families of preterm babies by providing 
            expert-backed guidance, corrected age tracking, and a supportive community. 
            We believe every preterm baby deserves the best start in life, and every 
            parent deserves the resources and support to help their child thrive.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="timeline" size={20} color="#4A90E2" />
              <Text style={styles.featureText}>Corrected age tracking and milestones</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="forum" size={20} color="#E74C3C" />
              <Text style={styles.featureText}>Moderated community support</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="verified" size={20} color="#27AE60" />
              <Text style={styles.featureText}>Doctor-backed content and guidance</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="security" size={20} color="#F39C12" />
              <Text style={styles.featureText}>Secure and private data protection</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.linkItem} onPress={handleOpenPrivacy}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Icon name="open-in-new" size={16} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={handleOpenTerms}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Icon name="open-in-new" size={16} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity style={styles.linkItem} onPress={handleOpenWebsite}>
            <Text style={styles.linkText}>Visit our website</Text>
            <Icon name="open-in-new" size={16} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkItem} 
            onPress={() => Linking.openURL('mailto:support@neo-nest.com')}>
            <Text style={styles.linkText}>Contact support</Text>
            <Icon name="email" size={16} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for preterm families
          </Text>
          <Text style={styles.copyrightText}>
            © 2024 Neo-Nest. All rights reserved.
          </Text>
        </View>
      </ScrollView>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#95a5a6',
  },
  section: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
    flex: 1,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  linkText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default AboutScreen;