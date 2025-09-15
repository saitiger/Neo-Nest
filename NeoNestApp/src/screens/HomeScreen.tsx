
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useBabyProfile} from '../contexts/BabyProfileContext';
import {calculateCorrectedAge} from '../utils/correctedAge';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {primaryProfile, isLoading} = useBabyProfile();

  const handleCreateProfile = () => {
    navigation.navigate('BabyProfile' as never);
  };

  const getCorrectedAgeDisplay = () => {
    if (!primaryProfile) return null;
    
    try {
      const birthDate = new Date(primaryProfile.birthDate);
      const dueDate = new Date(primaryProfile.dueDate);
      const correctedAge = calculateCorrectedAge(birthDate, dueDate);
      
      return correctedAge.displayText;
    } catch {
      return 'Unable to calculate';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Neo-Nest</Text>
        <Text style={styles.subtitle}>Supporting preterm families</Text>
      </View>
      
      <View style={styles.content}>
        {primaryProfile ? (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Icon name="child-care" size={32} color="#3498db" />
              <View style={styles.profileInfo}>
                <Text style={styles.babyName}>{primaryProfile.name}</Text>
                <Text style={styles.correctedAge}>
                  Corrected Age: {getCorrectedAgeDisplay()}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleCreateProfile}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noProfileCard}>
            <Icon name="add-circle-outline" size={48} color="#3498db" />
            <Text style={styles.noProfileTitle}>Create Your Baby's Profile</Text>
            <Text style={styles.noProfileDescription}>
              Get started by creating a profile to track your baby's development with corrected age milestones.
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateProfile}>
              <Text style={styles.createButtonText}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.journeySection}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <Text style={styles.description}>
            Track your baby's development using corrected age milestones designed specifically for preterm babies.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  babyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  correctedAge: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  editButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  noProfileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noProfileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  noProfileDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  journeySection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default HomeScreen;