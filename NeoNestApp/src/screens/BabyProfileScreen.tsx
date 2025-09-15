import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBabyProfile} from '../contexts/BabyProfileContext';
import {calculateCorrectedAge} from '../utils/correctedAge';

interface BabyProfileScreenProps {
  navigation: any;
}

interface BabyProfileForm {
  name: string;
  birthDate: Date;
  dueDate: Date;
  gender: 'male' | 'female' | 'other' | '';
  birthWeight: string;
}

const BabyProfileScreen: React.FC<BabyProfileScreenProps> = ({navigation}) => {
  const {createProfile} = useBabyProfile();
  const [profile, setProfile] = useState<BabyProfileForm>({
    name: '',
    birthDate: new Date(),
    dueDate: new Date(),
    gender: '',
    birthWeight: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof BabyProfileForm, value: string | Date) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateProfile = (): boolean => {
    if (!profile.name.trim()) {
      Alert.alert('Error', 'Please enter your baby\'s name');
      return false;
    }

    if (profile.birthDate >= profile.dueDate) {
      Alert.alert('Error', 'Birth date must be before due date');
      return false;
    }

    const today = new Date();
    if (profile.birthDate > today) {
      Alert.alert('Error', 'Birth date cannot be in the future');
      return false;
    }

    if (profile.birthWeight && (isNaN(Number(profile.birthWeight)) || Number(profile.birthWeight) <= 0)) {
      Alert.alert('Error', 'Please enter a valid birth weight in grams');
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const profileData = {
        name: profile.name.trim(),
        birthDate: profile.birthDate.toISOString(),
        dueDate: profile.dueDate.toISOString(),
        gender: profile.gender || undefined,
        birthWeight: profile.birthWeight ? Number(profile.birthWeight) : undefined,
      };

      await createProfile(profileData);
      
      Alert.alert(
        'Success',
        `${profile.name}'s profile has been created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCorrectedAgePreview = (): string => {
    try {
      const correctedAge = calculateCorrectedAge(profile.birthDate, profile.dueDate);
      return correctedAge.displayText;
    } catch {
      return 'Invalid dates';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Baby Profile</Text>
            <Text style={styles.subtitle}>
              Tell us about your little one to get personalized milestone tracking
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Baby's Name *</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your baby's name"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birth Date *</Text>
              <Text style={styles.dateText}>
                {formatDate(profile.birthDate)}
              </Text>
              <Text style={styles.dateHint}>
                Tap to change date (feature coming soon)
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Original Due Date *</Text>
              <Text style={styles.dateText}>
                {formatDate(profile.dueDate)}
              </Text>
              <Text style={styles.dateHint}>
                Tap to change date (feature coming soon)
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender (Optional)</Text>
              <View style={styles.genderContainer}>
                {['male', 'female', 'other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      profile.gender === gender && styles.genderButtonSelected,
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                    disabled={isLoading}>
                    <Text
                      style={[
                        styles.genderButtonText,
                        profile.gender === gender && styles.genderButtonTextSelected,
                      ]}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birth Weight (Optional)</Text>
              <TextInput
                style={styles.input}
                value={profile.birthWeight}
                onChangeText={(value) => handleInputChange('birthWeight', value)}
                placeholder="Enter weight in grams (e.g., 2500)"
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            {profile.name && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Corrected Age Preview</Text>
                <Text style={styles.previewText}>
                  {profile.name}'s corrected age: {getCorrectedAgePreview()}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleSaveProfile}
              disabled={isLoading}>
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    color: '#2c3e50',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  dateHint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  genderButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: '#ffffff',
  },
  previewContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
});

export default BabyProfileScreen;