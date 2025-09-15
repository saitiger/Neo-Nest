import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Milestone} from '../data/milestones';

interface MilestoneDetailScreenProps {
  route: {
    params: {
      milestone: Milestone;
      currentStatus: 'achieved' | 'in-progress' | 'upcoming' | 'delayed';
    };
  };
  navigation: any;
}

const MilestoneDetailScreen: React.FC<MilestoneDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {milestone, currentStatus} = route.params;
  const [showLogModal, setShowLogModal] = useState(false);
  const [logNotes, setLogNotes] = useState('');
  const [achievedDate] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return '#27ae60';
      case 'in-progress':
        return '#f39c12';
      case 'upcoming':
        return '#95a5a6';
      case 'delayed':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'Achieved';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      case 'delayed':
        return 'Needs Attention';
      default:
        return 'Unknown';
    }
  };

  const handleLogMilestone = () => {
    if (currentStatus === 'achieved') {
      Alert.alert('Already Achieved', 'This milestone has already been marked as achieved.');
      return;
    }
    setShowLogModal(true);
  };

  const handleSaveLog = () => {
    // TODO: Implement actual milestone logging to storage
    Alert.alert(
      'Success',
      'Milestone logged successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowLogModal(false);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatAgeRange = () => {
    const [minWeeks, maxWeeks] = milestone.correctedAgeRangeWeeks;
    const minMonths = Math.floor(minWeeks / 4.33);
    const maxMonths = Math.floor(maxWeeks / 4.33);
    
    if (maxWeeks <= 12) {
      return `${minWeeks}-${maxWeeks} weeks`;
    } else {
      return `${minMonths}-${maxMonths} months`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{milestone.title}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(currentStatus)},
            ]}>
            <Text style={styles.statusText}>{getStatusText(currentStatus)}</Text>
          </View>
        </View>

        {/* Milestone Details */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{milestone.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expected Age Range</Text>
            <Text style={styles.ageRange}>{formatAgeRange()}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.category}>
              {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)} Development
            </Text>
          </View>

          {milestone.clinicalNotes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Clinical Notes</Text>
              <Text style={styles.clinicalNotes}>{milestone.clinicalNotes}</Text>
            </View>
          )}

          {milestone.watchForDelayWeeks && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>When to Be Concerned</Text>
              <Text style={styles.delayInfo}>
                If not achieved by {Math.floor(milestone.watchForDelayWeeks / 4.33)} months corrected age, 
                consider discussing with your pediatrician.
              </Text>
            </View>
          )}

          {milestone.isPreterm && (
            <View style={styles.pretermNote}>
              <Text style={styles.pretermNoteText}>
                📝 This milestone is particularly important for preterm babies and may occur 
                later than in full-term babies. Always use corrected age for comparison.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.logButton,
                currentStatus === 'achieved' && styles.logButtonDisabled,
              ]}
              onPress={handleLogMilestone}
              disabled={currentStatus === 'achieved'}>
              <Text style={styles.logButtonText}>
                {currentStatus === 'achieved' ? 'Already Achieved' : 'Mark as Achieved'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => Alert.alert('Feature Coming Soon', 'Sharing functionality will be available soon!')}>
              <Text style={styles.shareButtonText}>Share with Provider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Log Milestone Modal */}
      <Modal
        visible={showLogModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLogModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Log Milestone</Text>
            <TouchableOpacity onPress={handleSaveLog}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalMilestoneTitle}>{milestone.title}</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Achievement Date</Text>
              <Text style={styles.modalDateText}>
                {achievedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.modalDateHint}>
                Tap to change date (feature coming soon)
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Notes (Optional)</Text>
              <TextInput
                style={styles.modalNotesInput}
                value={logNotes}
                onChangeText={setLogNotes}
                placeholder="Add any notes about this milestone achievement..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Photo/Video (Coming Soon)</Text>
              <TouchableOpacity
                style={styles.modalMediaButton}
                onPress={() => Alert.alert('Feature Coming Soon', 'Media capture will be available in the next update!')}>
                <Text style={styles.modalMediaButtonText}>+ Add Photo or Video</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  ageRange: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  category: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  clinicalNotes: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  delayInfo: {
    fontSize: 14,
    color: '#e74c3c',
    lineHeight: 20,
  },
  pretermNote: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  pretermNoteText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  logButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  logButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  shareButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: 'white',
  },
  modalCancelText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalSaveText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalMilestoneTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  modalDateText: {
    fontSize: 16,
    color: '#2c3e50',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  modalDateHint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalNotesInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    minHeight: 100,
  },
  modalMediaButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
  },
  modalMediaButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MilestoneDetailScreen;