import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScreenProps, OnboardingStackParamList} from '../../navigation/NavigationTypes';



interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 'corrected-age',
    icon: 'timeline',
    title: 'Corrected Age Tracking',
    description: 'Track your baby\'s development using corrected age milestones designed specifically for preterm babies.',
    color: '#4A90E2',
  },
  {
    id: 'milestones',
    icon: 'check-circle',
    title: 'Milestone Monitoring',
    description: 'Monitor developmental milestones with expert guidance and celebrate every achievement.',
    color: '#27AE60',
  },
  {
    id: 'community',
    icon: 'forum',
    title: 'Expert Community',
    description: 'Connect with other NICU parents and get advice from healthcare professionals.',
    color: '#E74C3C',
  },
  {
    id: 'content',
    icon: 'library-books',
    title: 'Doctor-Backed Content',
    description: 'Access clinically reviewed articles and resources tailored to your baby\'s needs.',
    color: '#F39C12',
  },
];

const FeaturesScreen: React.FC<ScreenProps<OnboardingStackParamList['Features']>> = ({
  navigation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Permissions');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const currentFeature = features[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.iconContainer, {backgroundColor: currentFeature.color}]}>
          <Icon name={currentFeature.icon} size={60} color="#ffffff" />
        </View>

        <Text style={styles.title}>{currentFeature.title}</Text>
        <Text style={styles.description}>{currentFeature.description}</Text>

        <View style={styles.illustration}>
          {/* Placeholder for feature illustration */}
          <View style={[styles.illustrationBox, {borderColor: currentFeature.color}]}>
            <Icon name={currentFeature.icon} size={40} color={currentFeature.color} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, {backgroundColor: currentFeature.color}]}
          onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex < features.length - 1 ? 'Next' : 'Continue'}
          </Text>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e1e8ed',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
    width: 24,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustrationBox: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default FeaturesScreen;