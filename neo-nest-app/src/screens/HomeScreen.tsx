import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { BabyProfile } from '../types';
import { calculateCorrectedAge, formatCorrectedAge, getWeeksPremature } from '../utils/correctedAge';

interface HomeScreenProps {
  baby: BabyProfile;
  onNavigateToMilestones: () => void;
  onNavigateToContent: () => void;
  onNavigateToCommunity: () => void;
  onNavigateToPlayLibrary: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  baby,
  onNavigateToMilestones,
  onNavigateToContent,
  onNavigateToCommunity,
  onNavigateToPlayLibrary,
}) => {
  const correctedAge = calculateCorrectedAge(baby.birthDate, baby.dueDate);
  const weeksPremature = getWeeksPremature(baby.birthDate, baby.dueDate);
  const formattedAge = formatCorrectedAge(correctedAge);

  const completedMilestones = baby.milestones.filter(m => m.status === 'achieved').length;
  const totalMilestones = baby.milestones.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.babyName}>{baby.name || 'Your Baby'}</Text>
        </View>

        {/* Baby Info Card */}
        <View style={styles.babyInfoCard}>
          <View style={styles.ageSection}>
            <Text style={styles.ageLabel}>Corrected Age</Text>
            <Text style={styles.ageValue}>{formattedAge}</Text>
            {weeksPremature > 0 && (
              <Text style={styles.prematureInfo}>
                Born {weeksPremature} week{weeksPremature !== 1 ? 's' : ''} early
              </Text>
            )}
          </View>
          
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Milestone Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedMilestones} of {totalMilestones} milestones achieved
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={onNavigateToMilestones}>
            <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Track Milestones</Text>
              <Text style={styles.actionSubtitle}>
                Log your baby's developmental progress
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={onNavigateToContent}>
            <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
              <Text style={styles.actionIconText}>📚</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Expert Content</Text>
              <Text style={styles.actionSubtitle}>
                Doctor-backed articles and videos
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={onNavigateToPlayLibrary}>
            <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.actionIconText}>🎯</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Play Activities</Text>
              <Text style={styles.actionSubtitle}>
                Age-appropriate activities and games
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={onNavigateToCommunity}>
            <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
              <Text style={styles.actionIconText}>👥</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Community</Text>
              <Text style={styles.actionSubtitle}>
                Connect with other preterm parents
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              Welcome to Neo-Nest! Start by tracking your first milestone.
            </Text>
            <Text style={styles.activityTime}>Just now</Text>
          </View>
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
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  babyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  babyInfoCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ageLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ageValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  prematureInfo: {
    fontSize: 12,
    color: '#999',
  },
  progressSection: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionArrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  recentActivity: {
    margin: 20,
    marginTop: 0,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;