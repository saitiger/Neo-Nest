import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import MilestonesScreen from '../../src/screens/MilestonesScreen';
import BabyProfileScreen from '../../src/screens/BabyProfileScreen';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { BabyProfileProvider } from '../../src/contexts/BabyProfileContext';
import { MilestoneProvider } from '../../src/contexts/MilestoneContext';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  setOptions: jest.fn(),
};

const mockRoute = {
  params: {},
};

// Provider wrapper
const TestProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <BabyProfileProvider>
      <MilestoneProvider>
        {children}
      </MilestoneProvider>
    </BabyProfileProvider>
  </AuthProvider>
);

describe('Cross-Platform UI Consistency Tests', () => {
  describe('iOS Platform Tests', () => {
    beforeAll(() => {
      Platform.OS = 'ios';
    });

    it('should render HomeScreen consistently on iOS', () => {
      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      // Test iOS-specific elements
      expect(getByTestId('home-screen')).toBeTruthy();
      
      // Verify iOS-specific styling is applied
      const homeContainer = getByTestId('home-container');
      expect(homeContainer.props.style).toEqual(
        expect.objectContaining({
          paddingTop: expect.any(Number), // iOS safe area
        })
      );
    });

    it('should render MilestonesScreen with iOS navigation patterns', () => {
      const { getByTestId } = render(
        <MilestonesScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      expect(getByTestId('milestones-screen')).toBeTruthy();
      
      // iOS should use specific navigation button styles
      const navigationHeader = getByTestId('milestones-header');
      expect(navigationHeader).toBeTruthy();
    });

    it('should handle iOS-specific date picker behavior', () => {
      const { getByTestId } = render(
        <BabyProfileScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      const datePicker = getByTestId('birth-date-picker');
      expect(datePicker).toBeTruthy();
      
      // iOS date picker should have specific props
      expect(datePicker.props.mode).toBe('date');
    });
  });

  describe('Android Platform Tests', () => {
    beforeAll(() => {
      Platform.OS = 'android';
    });

    it('should render HomeScreen consistently on Android', () => {
      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      expect(getByTestId('home-screen')).toBeTruthy();
      
      // Verify Android-specific styling
      const homeContainer = getByTestId('home-container');
      expect(homeContainer.props.style).toEqual(
        expect.objectContaining({
          paddingTop: expect.any(Number), // Android status bar
        })
      );
    });

    it('should render MilestonesScreen with Android Material Design', () => {
      const { getByTestId } = render(
        <MilestonesScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      expect(getByTestId('milestones-screen')).toBeTruthy();
      
      // Android should use Material Design patterns
      const fab = getByTestId('add-milestone-fab');
      expect(fab).toBeTruthy();
    });

    it('should handle Android-specific date picker behavior', () => {
      const { getByTestId } = render(
        <BabyProfileScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      const datePicker = getByTestId('birth-date-picker');
      expect(datePicker).toBeTruthy();
      
      // Android date picker should have specific configuration
      expect(datePicker.props.display).toBe('default');
    });
  });

  describe('Responsive Design Tests', () => {
    const screenSizes = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 360, height: 640, name: 'Android Small' },
      { width: 411, height: 731, name: 'Android Medium' },
      { width: 768, height: 1024, name: 'Tablet' },
    ];

    screenSizes.forEach(({ width, height, name }) => {
      it(`should render correctly on ${name} (${width}x${height})`, () => {
        // Mock screen dimensions
        jest.doMock('react-native', () => ({
          ...jest.requireActual('react-native'),
          Dimensions: {
            get: () => ({ width, height }),
          },
        }));

        const { getByTestId } = render(
          <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
          { wrapper: TestProviders }
        );

        const homeScreen = getByTestId('home-screen');
        expect(homeScreen).toBeTruthy();

        // Verify responsive layout adjustments
        if (width < 400) {
          // Small screens should use compact layout
          expect(getByTestId('compact-layout')).toBeTruthy();
        } else if (width > 600) {
          // Large screens should use expanded layout
          expect(getByTestId('expanded-layout')).toBeTruthy();
        }
      });
    });
  });

  describe('Accessibility Consistency Tests', () => {
    it('should provide consistent accessibility labels across platforms', () => {
      const { getByLabelText } = render(
        <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      // Test common accessibility labels
      expect(getByLabelText('Navigate to milestones')).toBeTruthy();
      expect(getByLabelText('Navigate to baby profile')).toBeTruthy();
      expect(getByLabelText('Navigate to community')).toBeTruthy();
    });

    it('should support screen reader navigation', () => {
      const { getByTestId } = render(
        <MilestonesScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      const milestoneList = getByTestId('milestone-list');
      expect(milestoneList.props.accessible).toBe(true);
      expect(milestoneList.props.accessibilityRole).toBe('list');
    });

    it('should provide proper focus management', () => {
      const { getByTestId } = render(
        <BabyProfileScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      const firstInput = getByTestId('baby-name-input');
      expect(firstInput.props.accessibilityAutoFocus).toBe(true);
    });
  });

  describe('Performance Consistency Tests', () => {
    it('should maintain consistent render times across platforms', async () => {
      const platforms = ['ios', 'android'];
      const renderTimes: Record<string, number> = {};

      for (const platform of platforms) {
        Platform.OS = platform as any;
        
        const startTime = performance.now();
        
        render(
          <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
          { wrapper: TestProviders }
        );
        
        const endTime = performance.now();
        renderTimes[platform] = endTime - startTime;
      }

      // Render times should be within 50% of each other
      const timeDifference = Math.abs(renderTimes.ios - renderTimes.android);
      const averageTime = (renderTimes.ios + renderTimes.android) / 2;
      const percentageDifference = (timeDifference / averageTime) * 100;

      expect(percentageDifference).toBeLessThan(50);
    });

    it('should handle large datasets consistently', () => {
      const largeMilestoneList = Array.from({ length: 1000 }, (_, index) => ({
        id: `milestone-${index}`,
        category: 'motor',
        description: `Test milestone ${index}`,
        status: 'not_started' as const,
      }));

      // Mock large dataset
      jest.doMock('../../src/contexts/MilestoneContext', () => ({
        useMilestone: () => ({
          milestones: largeMilestoneList,
          logMilestone: jest.fn(),
        }),
      }));

      const startTime = performance.now();
      
      const { getByTestId } = render(
        <MilestonesScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(getByTestId('milestones-screen')).toBeTruthy();
      expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds
    });
  });

  describe('Offline Functionality Tests', () => {
    it('should maintain functionality when offline', () => {
      // Mock offline state
      jest.doMock('@react-native-community/netinfo', () => ({
        useNetInfo: () => ({
          isConnected: false,
          isInternetReachable: false,
        }),
      }));

      const { getByTestId, getByText } = render(
        <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      expect(getByTestId('home-screen')).toBeTruthy();
      
      // Should show offline indicator
      expect(getByText('Offline mode')).toBeTruthy();
      
      // Core functionality should still work
      expect(getByTestId('corrected-age-display')).toBeTruthy();
    });

    it('should sync data when coming back online', async () => {
      // Mock coming back online
      const mockNetInfo = {
        isConnected: true,
        isInternetReachable: true,
      };

      jest.doMock('@react-native-community/netinfo', () => ({
        useNetInfo: () => mockNetInfo,
        addEventListener: (callback: Function) => {
          // Simulate network change
          setTimeout(() => callback(mockNetInfo), 100);
          return jest.fn();
        },
      }));

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
        { wrapper: TestProviders }
      );

      // Should show sync indicator when coming online
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(getByTestId('sync-indicator')).toBeTruthy();
    });
  });
});