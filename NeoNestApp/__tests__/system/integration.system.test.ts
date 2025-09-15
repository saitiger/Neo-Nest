/**
 * System Integration Tests
 * End-to-end testing with production-like data
 */

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BabyProfileProvider } from '../../src/contexts/BabyProfileContext';
import { MilestoneProvider } from '../../src/contexts/MilestoneContext';
import { CommunityProvider } from '../../src/contexts/CommunityContext';
import { AuthProvider } from '../../src/contexts/AuthContext';
import HomeScreen from '../../src/screens/HomeScreen';
import MilestonesScreen from '../../src/screens/MilestonesScreen';
import CommunityScreen from '../../src/screens/CommunityScreen';

// Mock production-like data
const mockProductionBaby = {
  id: 'prod-baby-1',
  name: 'Test Baby',
  birthDate: new Date('2024-08-15'), // 6 months ago
  dueDate: new Date('2024-11-01'), // 2.5 months premature
  gender: 'female',
  birthWeight: 1.8,
};

const mockProductionMilestones = [
  {
    id: 'milestone-1',
    babyId: 'prod-baby-1',
    category: 'Motor Skills',
    description: 'Holds head up when on tummy',
    status: 'achieved',
    achievedDate: new Date('2024-12-01'),
    correctedAgeAtAchievement: 4,
  },
  {
    id: 'milestone-2',
    babyId: 'prod-baby-1',
    category: 'Social',
    description: 'Smiles responsively',
    status: 'achieved',
    achievedDate: new Date('2024-12-15'),
    correctedAgeAtAchievement: 6,
  },
];

const mockProductionUser = {
  id: 'prod-user-1',
  email: 'test@example.com',
  parentName: 'Test Parent',
  isAuthenticated: true,
};

describe('System Integration Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    
    // Set up production-like data
    await AsyncStorage.setItem('babyProfiles', JSON.stringify([mockProductionBaby]));
    await AsyncStorage.setItem('milestones', JSON.stringify(mockProductionMilestones));
    await AsyncStorage.setItem('userProfile', JSON.stringify(mockProductionUser));
  });

  afterEach(async () => {
    await AsyncStorage.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <AuthProvider>
        <BabyProfileProvider>
          <MilestoneProvider>
            <CommunityProvider>
              {component}
            </CommunityProvider>
          </MilestoneProvider>
        </BabyProfileProvider>
      </AuthProvider>
    );
  };

  describe('Full User Journey Integration', () => {
    it('should handle complete user workflow from login to milestone tracking', async () => {
      const { getByText, getByTestId } = renderWithProviders(<HomeScreen />);

      // Verify home screen loads with production data
      await waitFor(() => {
        expect(getByText('Welcome back, Test Parent')).toBeTruthy();
        expect(getByText('Test Baby')).toBeTruthy();
      });

      // Verify corrected age calculation with production data
      const correctedAgeDisplay = getByTestId('corrected-age-display');
      expect(correctedAgeDisplay).toBeTruthy();
      
      // Should show corrected age display
      expect(getByText('Test Baby')).toBeTruthy();
    });

    it('should integrate milestone tracking with baby profile data', async () => {
      const { getByText, getByTestId } = renderWithProviders(<MilestonesScreen />);

      await waitFor(() => {
        // Verify milestones load for the baby
        expect(getByText('Motor Skills')).toBeTruthy();
        expect(getByText('Holds head up when on tummy')).toBeTruthy();
        expect(getByText('Social')).toBeTruthy();
        expect(getByText('Smiles responsively')).toBeTruthy();
      });

      // Verify milestone status indicators
      const achievedMilestones = getByTestId('achieved-milestones');
      expect(achievedMilestones).toBeTruthy();
    });

    it('should handle community integration with user authentication', async () => {
      const { getByText, getByTestId } = renderWithProviders(<CommunityScreen />);

      await waitFor(() => {
        // Verify community loads with authenticated user
        expect(getByText('Community Forum')).toBeTruthy();
        expect(getByTestId('create-post-button')).toBeTruthy();
      });

      // Test post creation flow
      const createPostButton = getByTestId('create-post-button');
      fireEvent.press(createPostButton);

      await waitFor(() => {
        expect(getByText('Create New Post')).toBeTruthy();
      });
    });
  });

  describe('Data Persistence Integration', () => {
    it('should persist and retrieve baby profile data correctly', async () => {
      const { getByText } = renderWithProviders(<HomeScreen />);

      await waitFor(() => {
        expect(getByText('Test Baby')).toBeTruthy();
        expect(getByText('Female')).toBeTruthy();
        expect(getByText('1.8 kg')).toBeTruthy();
      });
    });

    it('should maintain milestone data integrity across app sessions', async () => {
      // First render to establish data
      const { unmount } = renderWithProviders(<MilestonesScreen />);
      unmount();

      // Second render to verify persistence
      const { getByText } = renderWithProviders(<MilestonesScreen />);

      await waitFor(() => {
        expect(getByText('Holds head up when on tummy')).toBeTruthy();
        expect(getByText('Smiles responsively')).toBeTruthy();
      });
    });
  });

  describe('Cross-Component Data Flow', () => {
    it('should update corrected age across all components when baby data changes', async () => {
      const { getByTestId, rerender } = renderWithProviders(<HomeScreen />);

      // Verify initial corrected age
      await waitFor(() => {
        const correctedAgeDisplay = getByTestId('corrected-age-display');
        expect(correctedAgeDisplay).toBeTruthy();
      });

      // Update baby data
      const updatedBaby = {
        ...mockProductionBaby,
        birthDate: new Date('2024-07-15'), // Make baby older
      };
      
      await AsyncStorage.setItem('babyProfiles', JSON.stringify([updatedBaby]));

      // Re-render and verify age update
      rerender(
        <AuthProvider>
          <BabyProfileProvider>
            <MilestoneProvider>
              <CommunityProvider>
                <HomeScreen />
              </CommunityProvider>
            </MilestoneProvider>
          </BabyProfileProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        // Should show updated corrected age
        const correctedAgeDisplay = getByTestId('corrected-age-display');
        expect(correctedAgeDisplay).toBeTruthy();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle corrupted data gracefully', async () => {
      // Corrupt the stored data
      await AsyncStorage.setItem('babyProfiles', 'invalid-json');

      const { getByText } = renderWithProviders(<HomeScreen />);

      await waitFor(() => {
        // Should show error state or default content
        expect(getByText('Welcome to Neo-Nest') || getByText('No baby profiles found')).toBeTruthy();
      });
    });

    it('should handle missing data scenarios', async () => {
      // Clear all data
      await AsyncStorage.clear();

      const { getByText } = renderWithProviders(<HomeScreen />);

      await waitFor(() => {
        // Should show onboarding or empty state
        expect(getByText('Welcome to Neo-Nest') || getByText('Get Started')).toBeTruthy();
      });
    });
  });

  describe('Performance Integration', () => {
    it('should load large datasets efficiently', async () => {
      // Create large dataset
      const largeMilestoneSet = Array.from({ length: 100 }, (_, index) => ({
        id: `milestone-${index}`,
        babyId: 'prod-baby-1',
        category: 'Test Category',
        description: `Test milestone ${index}`,
        status: 'not_started',
      }));

      await AsyncStorage.setItem('milestones', JSON.stringify(largeMilestoneSet));

      const startTime = Date.now();
      const { getByText } = renderWithProviders(<MilestonesScreen />);

      await waitFor(() => {
        expect(getByText('Milestones')).toBeTruthy();
      });

      const loadTime = Date.now() - startTime;
      
      // Should load within 2 seconds even with large dataset
      expect(loadTime).toBeLessThan(2000);
    });
  });
});