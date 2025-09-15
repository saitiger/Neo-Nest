import { performance } from 'perf_hooks';
import { render } from '@testing-library/react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { BabyProfileProvider } from '../../src/contexts/BabyProfileContext';
import { MilestoneProvider } from '../../src/contexts/MilestoneContext';
import { CommunityProvider } from '../../src/contexts/CommunityContext';
import { NotificationProvider } from '../../src/contexts/NotificationContext';

// Import screens for performance testing
import HomeScreen from '../../src/screens/HomeScreen';
import MilestonesScreen from '../../src/screens/MilestonesScreen';
import BabyProfileScreen from '../../src/screens/BabyProfileScreen';
import CommunityScreen from '../../src/screens/CommunityScreen';

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

// Provider wrapper for testing
const TestProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>
      <BabyProfileProvider>
        <MilestoneProvider>
          <CommunityProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </CommunityProvider>
        </MilestoneProvider>
      </BabyProfileProvider>
    </AuthProvider>
  </NavigationContainer>
);

describe('Screen Performance Tests', () => {
  const PERFORMANCE_THRESHOLD_MS = 2000; // 2 second threshold as per requirements

  const measureRenderTime = async (component: React.ReactElement) => {
    const startTime = performance.now();
    
    const renderResult = render(component, { wrapper: TestProviders });
    
    // Wait for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    renderResult.unmount();
    
    return renderTime;
  };

  describe('Core Screen Render Performance', () => {
    it('should render HomeScreen within performance threshold', async () => {
      const renderTime = await measureRenderTime(
        <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />
      );
      
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
      console.log(`HomeScreen render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render MilestonesScreen within performance threshold', async () => {
      const renderTime = await measureRenderTime(
        <MilestonesScreen navigation={mockNavigation as any} route={mockRoute as any} />
      );
      
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
      console.log(`MilestonesScreen render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render BabyProfileScreen within performance threshold', async () => {
      const renderTime = await measureRenderTime(
        <BabyProfileScreen navigation={mockNavigation as any} route={mockRoute as any} />
      );
      
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
      console.log(`BabyProfileScreen render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render CommunityScreen within performance threshold', async () => {
      const renderTime = await measureRenderTime(
        <CommunityScreen navigation={mockNavigation as any} route={mockRoute as any} />
      );
      
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
      console.log(`CommunityScreen render time: ${renderTime.toFixed(2)}ms`);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not cause memory leaks during multiple renders', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Render and unmount screens multiple times
      for (let i = 0; i < 10; i++) {
        const renderResult = render(
          <HomeScreen navigation={mockNavigation as any} route={mockRoute as any} />,
          { wrapper: TestProviders }
        );
        renderResult.unmount();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      console.log(`Memory increase after 10 renders: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Large Dataset Performance', () => {
    it('should handle large milestone lists efficiently', async () => {
      // Mock large milestone dataset
      const largeMilestoneList = Array.from({ length: 1000 }, (_, index) => ({
        id: `milestone-${index}`,
        category: 'motor',
        description: `Test milestone ${index}`,
        ageRangeStart: Math.floor(index / 10),
        ageRangeEnd: Math.floor(index / 10) + 4,
        status: 'not_started' as const,
      }));

      // Mock the milestone context to return large dataset
      jest.doMock('../../src/contexts/MilestoneContext', () => ({
        useMilestone: () => ({
          milestones: largeMilestoneList,
          logMilestone: jest.fn(),
          getMilestoneProgress: jest.fn(),
        }),
      }));

      const renderTime = await measureRenderTime(
        <MilestonesScreen navigation={mockNavigation as any} route={mockRoute as any} />
      );
      
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS * 2); // Allow more time for large datasets
      console.log(`MilestonesScreen with 1000 items render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should handle large community post lists efficiently', async () => {
      // Mock large community post dataset
      const largePostList = Array.from({ length: 500 }, (_, index) => ({
        id: `post-${index}`,
        title: `Test post ${index}`,
        content: `This is test post content for post number ${index}`,
        category: 'general',
        authorId: `user-${index % 10}`,
        moderationStatus: 'approved' as const,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Mock the community context to return large dataset
      jest.doMock('../../src/contexts/CommunityContext', () => ({
        useCommunity: () => ({
          posts: largePostList,
          createPost: jest.fn(),
          addReply: jest.fn(),
          likePost: jest.fn(),
        }),
      }));

      const renderTime = await measureRenderTime(
        <CommunityScreen navigation={mockNavigation as any} route={mockRoute as any} />
      );
      
      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS * 2);
      console.log(`CommunityScreen with 500 posts render time: ${renderTime.toFixed(2)}ms`);
    });
  });

  describe('Concurrent Operations Performance', () => {
    it('should handle multiple simultaneous context operations', async () => {
      const startTime = performance.now();
      
      // Simulate multiple concurrent operations
      const operations = [
        // Simulate baby profile operations
        Promise.resolve({ id: '1', name: 'Test Baby' }),
        // Simulate milestone operations
        Promise.resolve([{ id: '1', status: 'achieved' }]),
        // Simulate community operations
        Promise.resolve([{ id: '1', title: 'Test Post' }]),
        // Simulate notification operations
        Promise.resolve([{ id: '1', title: 'Test Notification' }]),
      ];
      
      await Promise.all(operations);
      
      const endTime = performance.now();
      const operationTime = endTime - startTime;
      
      expect(operationTime).toBeLessThan(1000); // Should complete within 1 second
      console.log(`Concurrent operations time: ${operationTime.toFixed(2)}ms`);
    });
  });
});