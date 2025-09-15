import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { BabyProfile, Milestone, MilestoneCategory } from '../types';
import { calculateCorrectedAge, formatCorrectedAge } from '../utils/correctedAge';
import { milestoneCategories } from '../data/milestones';

interface MilestonesScreenProps {
  baby: BabyProfile;
  onUpdateMilestone: (milestoneId: string, status: Milestone['status'], achievedDate?: Date) => void;
}

const MilestonesScreen: React.FC<MilestonesScreenProps> = ({
  baby,
  onUpdateMilestone,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const correctedAge = calculateCorrectedAge(baby.birthDate, baby.dueDate);
  const formattedAge = formatCorrectedAge(correctedAge);

  const filteredMilestones = selectedCategory
    ? baby.milestones.filter(m => m.category.id === selectedCategory)
    : baby.milestones;

  const relevantMilestones = filteredMilestones.filter(
    m => correctedAge >= (m.correctedAgeAtAchievement || 0) - 4 && 
        correctedAge <= (m.correctedAgeAtAchievement || 0) + 8
  );

  const handleMilestonePress = (milestone: Milestone) => {
    const options = [
      { text: 'Not Started', value: 'not_started' as const },
      { text: 'In Progress', value: 'in_progress' as const },
      { text: 'Achieved', value: 'achieved' as const },
      { text: 'Needs Attention', value: 'delayed' as const },
    ];

    Alert.alert(
      milestone.description,
      'Update milestone status:',
      [
        ...options.map(option => ({
          text: option.text,
          onPress: () => {
            const achievedDate = option.value === 'achieved' ? new Date() : undefined;
            onUpdateMilestone(milestone.id, option.value, achievedDate);
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'delayed': return '#F44336';
      default: return '#E0E0E0';
    }
  };

  const getStatusText = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved': return 'Achieved';
      case 'in_progress': return 'In Progress';
      case 'delayed': return 'Needs Attention';
      default: return 'Not Started';
    }
  };

  const getCategoryStats = (categoryId: string) => {
    const categoryMilestones = baby.milestones.filter(m => m.category.id === categoryId);
    const achieved = categoryMilestones.filter(m => m.status === 'achieved').length;
    return { achieved, total: categoryMilestones.length };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Milestone Tracker</Text>
          <Text style={styles.subtitle}>
            Corrected Age: {formattedAge}
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === null && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === null && styles.categoryChipTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            {milestoneCategories.map(category => {
              const stats = getCategoryStats(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipActive,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={[
                    styles.categoryStats,
                    selectedCategory === category.id && styles.categoryStatsActive
                  ]}>
                    {stats.achieved}/{stats.total}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.progressGrid}>
            {milestoneCategories.map(category => {
              const stats = getCategoryStats(category.id);
              const percentage = stats.total > 0 ? (stats.achieved / stats.total) * 100 : 0;
              
              return (
                <View key={category.id} style={styles.progressItem}>
                  <View style={[styles.progressCircle, { borderColor: category.color }]}>
                    <Text style={[styles.progressPercentage, { color: category.color }]}>
                      {Math.round(percentage)}%
                    </Text>
                  </View>
                  <Text style={styles.progressLabel}>{category.name}</Text>
                  <Text style={styles.progressStats}>
                    {stats.achieved}/{stats.total}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Milestone List */}
        <View style={styles.milestoneList}>
          <Text style={styles.sectionTitle}>
            {selectedCategory 
              ? `${milestoneCategories.find(c => c.id === selectedCategory)?.name} Milestones`
              : 'Relevant Milestones'
            }
          </Text>
          
          {relevantMilestones.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No milestones found for the selected criteria.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Try selecting a different category or check back as your baby grows.
              </Text>
            </View>
          ) : (
            relevantMilestones.map(milestone => (
              <TouchableOpacity
                key={milestone.id}
                style={styles.milestoneCard}
                onPress={() => handleMilestonePress(milestone)}
              >
                <View style={styles.milestoneHeader}>
                  <View 
                    style={[
                      styles.milestoneStatus,
                      { backgroundColor: getStatusColor(milestone.status) }
                    ]}
                  />
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneDescription}>
                      {milestone.description}
                    </Text>
                    <Text style={styles.milestoneAge}>
                      Expected around {formatCorrectedAge(milestone.correctedAgeAtAchievement || 0)}
                    </Text>
                  </View>
                  <View style={styles.milestoneActions}>
                    <Text style={[
                      styles.milestoneStatusText,
                      { color: getStatusColor(milestone.status) }
                    ]}>
                      {getStatusText(milestone.status)}
                    </Text>
                    {milestone.achievedDate && (
                      <Text style={styles.achievedDate}>
                        {milestone.achievedDate.toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
                
                <View 
                  style={[
                    styles.categoryTag,
                    { backgroundColor: milestone.category.color + '20' }
                  ]}
                >
                  <Text style={[
                    styles.categoryTagText,
                    { color: milestone.category.color }
                  ]}>
                    {milestone.category.name}
                  </Text>
                </View>
                
                {milestone.notes && (
                  <Text style={styles.milestoneNotes}>
                    {milestone.notes}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  categoryFilter: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    marginRight: 8,
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  categoryStats: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  categoryStatsActive: {
    color: 'white',
  },
  progressOverview: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  progressStats: {
    fontSize: 10,
    color: '#999',
  },
  milestoneList: {
    margin: 20,
    marginTop: 0,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  milestoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  milestoneStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneDescription: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  milestoneAge: {
    fontSize: 14,
    color: '#666',
  },
  milestoneActions: {
    alignItems: 'flex-end',
  },
  milestoneStatusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  achievedDate: {
    fontSize: 12,
    color: '#999',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  milestoneNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default MilestonesScreen;