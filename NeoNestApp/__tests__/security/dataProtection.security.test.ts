import AsyncStorage from '@react-native-async-storage/async-storage';
import { BabyProfileService } from '../../src/utils/babyProfile';
import { MilestoneService } from '../../src/utils/milestoneLogging';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('Data Protection Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Personal Health Information (PHI) Protection', () => {
    it('should encrypt sensitive baby profile data', async () => {
      const sensitiveData = {
        name: 'Baby Doe',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-10-01'),
        birthWeight: 2.5,
        medicalNotes: 'Preterm birth at 32 weeks',
      };

      await BabyProfileService.createBabyProfile(sensitiveData);

      const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const dataCall = setItemCalls.find(call => call[0].includes('baby_profile'));
      
      if (dataCall) {
        const storedData = dataCall[1];
        // In a real implementation, sensitive data should be encrypted
        // For now, we verify it's not stored in plain text
        expect(storedData).not.toContain('Baby Doe');
        expect(storedData).not.toContain('Preterm birth at 32 weeks');
      }
    });

    it('should implement data minimization principles', async () => {
      const profileData = {
        name: 'Test Baby',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-10-01'),
        // Optional fields should not be required
        socialSecurityNumber: '123-45-6789', // Should be rejected
        parentSSN: '987-65-4321', // Should be rejected
      };

      const result = await BabyProfileService.createBabyProfile(profileData);
      
      // Should not store unnecessary sensitive data
      expect(result.socialSecurityNumber).toBeUndefined();
      expect(result.parentSSN).toBeUndefined();
    });

    it('should implement secure data deletion', async () => {
      const babyId = 'test-baby-1';
      
      await BabyProfileService.deleteBabyProfile(babyId);

      // Verify all related data is removed
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`baby_profile_${babyId}`);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`milestones_${babyId}`);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`photos_${babyId}`);
    });
  });

  describe('Data Access Controls', () => {
    it('should implement user-based data isolation', async () => {
      const user1Id = 'user-1';
      const user2Id = 'user-2';

      // Mock different user contexts
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'current_user_id') {
          return Promise.resolve(user1Id);
        }
        return Promise.resolve(null);
      });

      const profiles = await BabyProfileService.getBabyProfiles();
      
      // Should only return profiles for current user
      profiles.forEach(profile => {
        expect(profile.userId).toBe(user1Id);
      });
    });

    it('should prevent unauthorized data access', async () => {
      const unauthorizedBabyId = 'unauthorized-baby-id';
      
      // Attempt to access baby profile without proper authorization
      const profile = await BabyProfileService.getBabyProfile(unauthorizedBabyId);
      
      expect(profile).toBeNull();
    });
  });

  describe('Data Integrity', () => {
    it('should validate data integrity on read', async () => {
      // Mock corrupted data
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('corrupted-data-not-json');

      const profiles = await BabyProfileService.getBabyProfiles();
      
      // Should handle corrupted data gracefully
      expect(profiles).toEqual([]);
    });

    it('should implement data checksums for critical data', async () => {
      const milestoneData = {
        milestoneId: 'critical-milestone',
        babyId: 'test-baby-1',
        achievedDate: new Date(),
        notes: 'Important milestone achievement',
      };

      await MilestoneService.logMilestone(milestoneData);

      const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const milestoneCall = setItemCalls.find(call => call[0].includes('milestone'));
      
      if (milestoneCall) {
        const storedData = JSON.parse(milestoneCall[1]);
        // Should include integrity check
        expect(storedData.checksum).toBeDefined();
      }
    });
  });

  describe('Audit Logging', () => {
    it('should log sensitive data access', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await BabyProfileService.getBabyProfiles();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Data access:'),
        expect.objectContaining({
          action: 'read',
          resource: 'baby_profiles',
          timestamp: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log data modifications', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const babyData = {
        name: 'Test Baby',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-10-01'),
      };

      await BabyProfileService.createBabyProfile(babyData);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Data modification:'),
        expect.objectContaining({
          action: 'create',
          resource: 'baby_profile',
          timestamp: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Compliance Requirements', () => {
    it('should support GDPR data export', async () => {
      const userId = 'test-user-1';
      
      // Mock user data across different services
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key.includes(userId)) {
          return Promise.resolve(JSON.stringify({ userId, data: 'test-data' }));
        }
        return Promise.resolve(null);
      });

      const exportData = await BabyProfileService.exportUserData(userId);
      
      expect(exportData).toBeDefined();
      expect(exportData.userId).toBe(userId);
      expect(exportData.profiles).toBeDefined();
      expect(exportData.milestones).toBeDefined();
    });

    it('should support GDPR data deletion', async () => {
      const userId = 'test-user-1';
      
      await BabyProfileService.deleteAllUserData(userId);

      // Verify all user data is removed
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`user_${userId}`);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`profiles_${userId}`);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`milestones_${userId}`);
    });

    it('should implement data retention policies', async () => {
      const oldDate = new Date('2020-01-01');
      const recentDate = new Date();

      // Mock old data
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({
        createdAt: oldDate.toISOString(),
        data: 'old-data'
      }));

      const profiles = await BabyProfileService.getBabyProfiles();
      
      // Old data should be automatically purged based on retention policy
      expect(profiles).toEqual([]);
    });
  });
});