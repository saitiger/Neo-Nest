import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useBabyProfile} from '../contexts/BabyProfileContext';
import {useMilestone} from '../contexts/MilestoneContext';
import {calculateCorrectedAge} from '../utils/correctedAge';
import {getMilestonesForAge, milestoneCategories, Milestone, isMilestoneDelayed} from '../data/milestones';

interface MilestoneWithStatus extends Milestone {
  status: 'achieved' | 'in-progress' | 'upcoming' | 'delayed';
  achievedDate?: string;
}

interface MilestonesScreenProps {
  navigation: any;
}

const MilestonesScreen: React.FC<MilestonesScreenProps> = ({navigation}) => {
  const {primaryProfile} = useBabyProfile();
  const {getMilestoneStatus} = useMilestone();
  const [milestones, setMilestones] = useState<MilestoneWithStatus[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [correctedAge, setCorrectedAge] = useState<string>('');

  useEffect(() => {
    if (primaryProfile) {
      const birthDate = new Date(primaryProfile.birthDate);
      const dueDate = new Date(primaryProfile.dueDate);
      const ageResult = calculateCorrectedAge(birthDate, dueDate);
      setCorrectedAge(ageResult.displayText);

      // Get relevant milestones for current corrected age
      const relevantMilestones = getMilestonesForAge(ageResult.correctedAgeInWeeks, true);
      
      // Add status to each milestone using real data from milestone context
      const milestonesWithStatus: MilestoneWithStatus[] = relevantMilestones.map(milestone => {
        const status = getMilestoneStatus(milestone.id);
        const isDelayed = isMilestoneDelayed(milestone, ageResult.correctedAgeInWeeks);
        
        // If milestone is not achieved but should be, mark as delayed
        let finalStatus = status;
        if (status === 'upcoming' && ageResult.correctedAgeInWeeks > milestone.correctedAgeRangeWeeks[1]) {
          finalStatus = isDelayed ? 'delayed' : 'in-progress';
        } else if (status === 'upcoming' && ageResult.correctedAgeInWeeks >= milestone.correctedAgeRangeWeeks[0]) {
          finalStatus = 'in-progress';
        }

        return {
          ...milestone,
          status: finalStatus,
        };
      });

      setMilestones(milestonesWithStatus);
    }
  }, [primaryProfile]);

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

  const getCategoryDisplayName = (category: string) => {
    return milestoneCategories[category as keyof typeof milestoneCategories] || category;
  };

  const filteredMilestones = selectedCategory === 'all' 
    ? milestones 
    : milestones.filter(m => m.category === selectedCategory);

  const handleMilestonePress = (milestone: MilestoneWithStatus) => {
    navigation.navigate('MilestoneDetail', {
      milestone,
      currentStatus: milestone.status,
    });
  };

  if (!primaryProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Baby Profile</Text>
          <Text style={styles.emptyText}>
            Create a baby profile to start tracking milestones with corrected age calculations.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Milestones</Text>
        <Text style={styles.subtitle}>
          {primaryProfile.name}'s corrected age: {correctedAge}
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'all' && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory('all')}>
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === 'all' && styles.categoryButtonTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.entries(milestoneCategories).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryButton,
              selectedCategory === key && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(key)}>
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === key && styles.categoryButtonTextActive
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.content}>
        {filteredMilestones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Milestones</Text>
            <Text style={styles.emptyText}>
              No milestones found for the selected category and current age range.
            </Text>
          </View>
        ) : (
          filteredMilestones.map((milestone) => (
            <TouchableOpacity 
              key={milestone.id} 
              style={styles.milestoneCard}
              onPress={() => handleMilestonePress(milestone)}>
              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <View 
                  style={[
                    styles.statusBadge, 
                    {backgroundColor: getStatusColor(milestone.status)}
                  ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(milestone.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.categoryText}>
                {getCategoryDisplayName(milestone.category)}
              </Text>
              <Text style={styles.correctedAge}>
                Expected: {milestone.correctedAgeRangeWeeks[0]}-{milestone.correctedAgeRangeWeeks[1]} weeks
              </Text>
              <Text style={styles.description}>{milestone.description}</Text>
              {milestone.status === 'delayed' && (
                <Text style={styles.delayWarning}>
                  Consider discussing with your pediatrician
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  categoryFilter: {
    paddingVertical: 16,
  },
  categoryFilterContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryButtonActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  milestoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  categoryText: {
    fontSize: 12,
    color: '#4a90e2',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  correctedAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  delayWarning: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default MilestonesScreen;