import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScreenProps, MainStackParamList} from '../navigation/NavigationTypes';

interface ContactOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const HelpScreen: React.FC<ScreenProps<MainStackParamList['Help']>> = ({
  navigation,
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'Get help via email within 24 hours',
      icon: 'email',
      action: () => {
        Linking.openURL('mailto:support@neo-nest.com?subject=Help Request');
      },
    },
    {
      id: 'phone',
      title: 'Phone Support',
      subtitle: 'Call us at 1-800-NEO-NEST (1-800-636-6378)\nHours: Monday-Friday, 9 AM - 6 PM EST',
      icon: 'phone',
      action: () => {
        Alert.alert(
          'Phone Support',
          'Call us at 1-800-NEO-NEST (1-800-636-6378)\nHours: Monday-Friday, 9 AM - 6 PM EST',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Call Now', onPress: () => Linking.openURL('tel:18006366378')},
          ]
        );
      },
    },
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Chat with support (Monday-Friday, 9 AM - 6 PM)',
      icon: 'chat',
      action: () => {
        Alert.alert('Live Chat', 'Live chat feature coming soon!');
      },
    },
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'corrected-age',
      question: 'What is corrected age and why is it important?',
      answer: 'Corrected age is your baby\'s age based on their due date rather than their birth date. It\'s crucial for preterm babies because it provides more accurate expectations for developmental milestones. We use corrected age until your baby is 24 months old.',
    },
    {
      id: 'milestones',
      question: 'How do I track milestones for my preterm baby?',
      answer: 'Use the Milestones section to view age-appropriate milestones based on your baby\'s corrected age. You can log achievements, add notes, and export progress reports for your healthcare provider.',
    },
    {
      id: 'community',
      question: 'Is the community safe and moderated?',
      answer: 'Yes, our community is actively moderated by healthcare professionals. All posts are reviewed, and we have strict guidelines to ensure a safe, supportive environment for all families.',
    },
    {
      id: 'data-privacy',
      question: 'How is my baby\'s data protected?',
      answer: 'We use industry-standard encryption to protect your information. All data is stored securely on your device and never shared with third parties. We are committed to protecting your privacy.',
    },
    {
      id: 'expert-content',
      question: 'Who creates the expert content?',
      answer: 'All content is created and reviewed by board-certified pediatricians, neonatologists, and child development specialists with expertise in preterm infant care.',
    },
  ];

  const renderContactOption = (option: ContactOption) => {
    return (
      <TouchableOpacity
        key={option.id}
        style={styles.contactOption}
        onPress={option.action}>
        <View style={styles.contactIcon}>
          <Icon name={option.icon} size={24} color="#4A90E2" />
        </View>
        <View style={styles.contactContent}>
          <Text style={styles.contactTitle}>{option.title}</Text>
          <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#7f8c8d" />
      </TouchableOpacity>
    );
  };

  const renderFAQItem = (item: FAQItem) => {
    const isExpanded = expandedFAQ === item.id;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.faqItem}
        onPress={() => toggleFAQ(item.id)}>
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Icon 
            name={isExpanded ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#7f8c8d" 
          />
        </View>
        {isExpanded && (
          <View>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map(renderContactOption)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map(renderFAQItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://neo-nest.com/preterm-resources')}>
            <Icon name="library-books" size={24} color="#27AE60" />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Preterm Resources</Text>
              <Text style={styles.resourceSubtitle}>Educational articles and materials</Text>
            </View>
            <Icon name="open-in-new" size={20} color="#7f8c8d" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => Linking.openURL('https://neo-nest.com/user-guide')}>
            <Icon name="book" size={24} color="#4A90E2" />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>User Guide</Text>
              <Text style={styles.resourceSubtitle}>Complete guide to using Neo-Nest</Text>
            </View>
            <Icon name="open-in-new" size={20} color="#7f8c8d" />
          </TouchableOpacity>
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
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  contactContainer: {
    paddingVertical: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  faqContainer: {
    paddingVertical: 16,
  },
  faqItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginTop: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  resourceContent: {
    flex: 1,
    marginLeft: 16,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default HelpScreen;