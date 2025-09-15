import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import MilestonesScreen from './src/screens/MilestonesScreen';
import { BabyProfile, Milestone } from './src/types';
import { sampleMilestones, milestoneCategories } from './src/data/milestones';

// Sample baby data
const sampleBaby: BabyProfile = {
  id: '1',
  name: 'Emma',
  birthDate: new Date('2024-08-15'), // Born about 4 months ago
  dueDate: new Date('2024-10-01'), // Was due 6 weeks later
  correctedAge: 10, // Will be calculated
  gender: 'female',
  birthWeight: 2.1,
  milestones: sampleMilestones.map((milestone, index) => ({
    ...milestone,
    id: `milestone-${index}`,
    babyId: '1',
  })),
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'milestones'>('home');
  const [baby, setBaby] = useState<BabyProfile>(sampleBaby);

  const handleUpdateMilestone = (
    milestoneId: string, 
    status: Milestone['status'], 
    achievedDate?: Date
  ) => {
    setBaby(prevBaby => ({
      ...prevBaby,
      milestones: prevBaby.milestones.map(milestone =>
        milestone.id === milestoneId
          ? { ...milestone, status, achievedDate }
          : milestone
      ),
    }));
  };

  const navigateToMilestones = () => setCurrentScreen('milestones');
  const navigateToHome = () => setCurrentScreen('home');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {currentScreen === 'home' ? (
        <HomeScreen
          baby={baby}
          onNavigateToMilestones={navigateToMilestones}
          onNavigateToContent={() => console.log('Navigate to Content')}
          onNavigateToCommunity={() => console.log('Navigate to Community')}
          onNavigateToPlayLibrary={() => console.log('Navigate to Play Library')}
        />
      ) : (
        <MilestonesScreen
          baby={baby}
          onUpdateMilestone={handleUpdateMilestone}
        />
      )}
      
      {/* Simple navigation for demo */}
      {currentScreen === 'milestones' && (
        <View style={styles.backButton}>
          <button onClick={navigateToHome} style={styles.button}>
            ← Back to Home
          </button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    cursor: 'pointer',
  },
});

export default App;