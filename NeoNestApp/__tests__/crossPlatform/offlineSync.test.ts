import AsyncStorage from '@react-native-async-storage/async-storage';
import { BabyProfileService } from '../../src/utils/babyProfile';
import { MilestoneService } from '../../src/utils/milestoneLogging';
import { CommunityService } from '../../src/utils/communityService';

// Mock AsyncStorage and network
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-community/netinfo');

describe('Offline Synchronization Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Offline Data Storage', () => {
    it('should store data locally when offline', async () => {
      // Mock offline state
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const babyData = {
        name: 'Offline Baby',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-10-01'),
      };

      const result = await BabyProfileService.createBabyProfile(babyData);
      
      expect(result).toBeDefined();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('baby_profile'),
        expect.any(String)
      );
    });

    it('should queue operations for sync when offline', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const milestoneData = {
        milestoneId: 'offline-milestone',
        babyId: 'test-baby-1',
        achievedDate: new Date(),
        notes: 'Logged while offline',
      };

      await MilestoneService.logMilestone(milestoneData);

      // Should store in sync queue
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sync_queue',
        expect.stringContaining('offline-milestone')
      );
    });

    it('should handle offline community posts', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const postData = {
        title: 'Offline Post',
        content: 'This post was created offline',
        category: 'general',
        authorId: 'test-user-1',
      };

      const result = await CommunityService.createPost(postData);
      
      expect(result).toBeDefined();
      expect(result.status).toBe('pending_sync');
    });
  });

  describe('Data Synchronization', () => {
    it('should sync queued operations when coming online', async () => {
      // Mock sync queue with pending operations
      const syncQueue = [
        {
          id: 'sync-1',
          type: 'CREATE_MILESTONE',
          data: {
            milestoneId: 'queued-milestone',
            babyId: 'test-baby-1',
            achievedDate: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        },
        {
          id: 'sync-2',
          type: 'CREATE_POST',
          data: {
            title: 'Queued Post',
            content: 'This was queued for sync',
          },
          timestamp: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'sync_queue') {
          return Promise.resolve(JSON.stringify(syncQueue));
        }
        return Promise.resolve(null);
      });

      // Mock successful network requests
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // Simulate coming online and triggering sync
      const syncResult = await MilestoneService.syncPendingOperations();
      
      expect(syncResult.success).toBe(true);
      expect(syncResult.syncedCount).toBe(2);
      
      // Sync queue should be cleared
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sync_queue');
    });

    it('should handle partial sync failures', async () => {
      const syncQueue = [
        {
          id: 'sync-1',
          type: 'CREATE_MILESTONE',
          data: { milestoneId: 'milestone-1' },
        },
        {
          id: 'sync-2',
          type: 'CREATE_MILESTONE',
          data: { milestoneId: 'milestone-2' },
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(syncQueue));

      // Mock partial failure
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockRejectedValueOnce(new Error('Server error'));

      const syncResult = await MilestoneService.syncPendingOperations();
      
      expect(syncResult.success).toBe(false);
      expect(syncResult.syncedCount).toBe(1);
      expect(syncResult.failedCount).toBe(1);
      
      // Failed operations should remain in queue
      const remainingQueue = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls
          .find(call => call[0] === 'sync_queue')?.[1] || '[]'
      );
      expect(remainingQueue).toHaveLength(1);
      expect(remainingQueue[0].id).toBe('sync-2');
    });

    it('should resolve sync conflicts', async () => {
      // Mock conflict scenario - same milestone logged offline and online
      const localMilestone = {
        id: 'milestone-1',
        milestoneId: 'social-smile',
        achievedDate: new Date('2024-12-15T10:00:00Z'),
        notes: 'Offline version',
        lastModified: new Date('2024-12-15T10:00:00Z'),
      };

      const serverMilestone = {
        id: 'milestone-1',
        milestoneId: 'social-smile',
        achievedDate: new Date('2024-12-15T09:30:00Z'),
        notes: 'Online version',
        lastModified: new Date('2024-12-15T09:30:00Z'),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([localMilestone]));
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([serverMilestone]),
      });

      const syncResult = await MilestoneService.syncWithServer();
      
      // Should resolve conflict using latest timestamp
      expect(syncResult.conflicts).toHaveLength(1);
      expect(syncResult.resolved).toHaveLength(1);
      
      // Local version should win (later timestamp)
      const resolvedMilestone = syncResult.resolved[0];
      expect(resolvedMilestone.notes).toBe('Offline version');
    });
  });

  describe('Offline Data Integrity', () => {
    it('should maintain data consistency during offline operations', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      // Create baby profile offline
      const babyData = {
        name: 'Consistency Test Baby',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-10-01'),
      };

      const baby = await BabyProfileService.createBabyProfile(babyData);
      
      // Log milestone for the same baby offline
      const milestoneData = {
        milestoneId: 'first-smile',
        babyId: baby.id,
        achievedDate: new Date(),
        notes: 'Offline milestone',
      };

      const milestone = await MilestoneService.logMilestone(milestoneData);
      
      // Verify relationship is maintained
      expect(milestone.babyId).toBe(baby.id);
      
      // Verify data can be retrieved consistently
      const savedBaby = await BabyProfileService.getBabyProfile(baby.id);
      const babyMilestones = await MilestoneService.getMilestoneProgress(baby.id);
      
      expect(savedBaby?.id).toBe(baby.id);
      expect(babyMilestones.achieved).toHaveLength(1);
      expect(babyMilestones.achieved[0].babyId).toBe(baby.id);
    });

    it('should handle storage quota limits gracefully', async () => {
      // Mock storage quota exceeded
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('QuotaExceededError')
      );

      const babyData = {
        name: 'Quota Test Baby',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-10-01'),
      };

      // Should handle quota error gracefully
      await expect(BabyProfileService.createBabyProfile(babyData)).rejects.toThrow();
      
      // Should attempt cleanup of old data
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        expect.stringContaining('old_data')
      );
    });
  });

  describe('Network State Management', () => {
    it('should detect network state changes', async () => {
      const mockNetInfo = require('@react-native-community/netinfo');
      const networkCallback = jest.fn();

      mockNetInfo.addEventListener.mockImplementation((callback: Function) => {
        networkCallback.mockImplementation(callback);
        return jest.fn(); // unsubscribe function
      });

      // Initialize network monitoring
      await MilestoneService.initializeNetworkMonitoring();

      // Simulate going offline
      networkCallback({ isConnected: false, isInternetReachable: false });
      
      // Simulate coming back online
      networkCallback({ isConnected: true, isInternetReachable: true });

      expect(networkCallback).toHaveBeenCalledTimes(2);
    });

    it('should retry failed operations with exponential backoff', async () => {
      let attemptCount = 0;
      global.fetch = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      });

      const milestoneData = {
        milestoneId: 'retry-milestone',
        babyId: 'test-baby-1',
        achievedDate: new Date(),
      };

      const result = await MilestoneService.logMilestone(milestoneData);
      
      expect(attemptCount).toBe(3);
      expect(result).toBeDefined();
    });
  });

  describe('Data Migration and Versioning', () => {
    it('should handle data schema migrations during sync', async () => {
      // Mock old version data
      const oldVersionData = {
        version: 1,
        milestones: [
          {
            id: 'old-milestone',
            name: 'Old Milestone', // Old schema field
            date: '2024-12-15',
          }
        ]
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(oldVersionData));

      const migratedData = await MilestoneService.migrateData();
      
      expect(migratedData.version).toBe(2); // Current version
      expect(migratedData.milestones[0].description).toBe('Old Milestone'); // Migrated field
      expect(migratedData.milestones[0].achievedDate).toBeDefined(); // New field
    });

    it('should backup data before migration', async () => {
      const originalData = {
        version: 1,
        data: 'original-data'
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(originalData));

      await MilestoneService.migrateData();

      // Should create backup before migration
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'data_backup_v1',
        JSON.stringify(originalData)
      );
    });
  });
});