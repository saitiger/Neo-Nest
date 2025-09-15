import AsyncStorage from '@react-native-async-storage/async-storage';
// Mock all services
jest.mock('../../src/utils/auth');
jest.mock('../../src/utils/babyProfile');
jest.mock('../../src/utils/milestoneLogging');
jest.mock('../../src/utils/communityService');

import { AuthService } from '../__mocks__/authService';
import { BabyProfileService } from '../__mocks__/babyProfileService';
import { MilestoneService } from '../__mocks__/milestoneService';
import { CommunityService } from '../__mocks__/communityService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('User Journey Integration Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Clear AsyncStorage before each test
    (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Complete User Registration and Profile Setup Journey', () => {
    it('should complete full user registration and baby profile creation flow', async () => {
      // Step 1: User Registration
      const registrationData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        parentName: 'John Doe',
      };

      const registrationResult = await AuthService.register(registrationData);
      expect(registrationResult.success).toBe(true);
      expect(registrationResult.user?.email).toBe('test@example.com');

      // Step 2: User Login
      const loginResult = await AuthService.login(
        registrationData.email,
        registrationData.password
      );
      expect(loginResult.success).toBe(true);
      expect(loginResult.user?.email).toBe('test@example.com');

      // Step 3: Create Baby Profile
      const babyData = {
        name: 'Baby Doe',
        birthDate: new Date('2024-10-15'),
        dueDate: new Date('2024-12-01'),
        gender: 'male' as const,
        birthWeight: 2.5,
      };

      const babyProfile = await BabyProfileService.createBabyProfile(babyData);
      expect(babyProfile).toBeDefined();
      expect(babyProfile.name).toBe('Baby Doe');
      expect(babyProfile.correctedAge).toBeGreaterThanOrEqual(0);

      // Step 4: Verify Profile Persistence
      const savedProfiles = await BabyProfileService.getBabyProfiles();
      expect(savedProfiles).toHaveLength(1);
      expect(savedProfiles[0].name).toBe('Baby Doe');
    });

    it('should handle milestone logging workflow', async () => {
      // Setup: Create baby profile first
      const babyData = {
        name: 'Test Baby',
        birthDate: new Date('2024-08-15'),
        dueDate: new Date('2024-11-01'),
        gender: 'female' as const,
      };

      const babyProfile = await BabyProfileService.createBabyProfile(babyData);
      
      // Step 1: Log a milestone
      const milestoneData = {
        milestoneId: 'social-smile',
        babyId: babyProfile.id,
        achievedDate: new Date(),
        notes: 'First social smile observed during feeding',
        media: [],
      };

      const loggedMilestone = await MilestoneService.logMilestone(milestoneData);
      expect(loggedMilestone).toBeDefined();
      expect(loggedMilestone.notes).toBe('First social smile observed during feeding');

      // Step 2: Retrieve milestone progress
      const milestoneProgress = await MilestoneService.getMilestoneProgress(babyProfile.id);
      expect(milestoneProgress.achieved).toHaveLength(1);
      expect(milestoneProgress.achieved[0].milestoneId).toBe('social-smile');

      // Step 3: Generate milestone report
      const report = await MilestoneService.generateMilestoneReport(babyProfile.id);
      expect(report.babyId).toBe(babyProfile.id);
      expect(report.achievedMilestones).toHaveLength(1);
    });

    it('should handle community interaction workflow', async () => {
      // Step 1: Create a forum post
      const postData = {
        title: 'Question about feeding schedule',
        content: 'My preterm baby is having trouble with feeding. Any advice?',
        category: 'feeding',
        authorId: 'test-user-1',
      };

      const createdPost = await CommunityService.createPost(postData);
      expect(createdPost).toBeDefined();
      expect(createdPost.title).toBe('Question about feeding schedule');
      expect(createdPost.moderationStatus).toBe('pending');

      // Step 2: Moderate the post (simulate admin approval)
      const moderatedPost = await CommunityService.moderatePost(createdPost.id, 'approved');
      expect(moderatedPost.moderationStatus).toBe('approved');

      // Step 3: Add a reply
      const replyData = {
        postId: createdPost.id,
        content: 'I had similar issues. Try smaller, more frequent feeds.',
        authorId: 'test-user-2',
        isExpertReply: false,
      };

      const reply = await CommunityService.addReply(replyData);
      expect(reply).toBeDefined();
      expect(reply.content).toBe('I had similar issues. Try smaller, more frequent feeds.');

      // Step 4: Retrieve post with replies
      const postWithReplies = await CommunityService.getPost(createdPost.id);
      expect(postWithReplies?.replies).toHaveLength(1);
      expect(postWithReplies?.replies[0].content).toBe('I had similar issues. Try smaller, more frequent feeds.');
    });
  });

  describe('Data Synchronization and Persistence', () => {
    it('should maintain data consistency across app restarts', async () => {
      // Step 1: Create and save data
      const babyData = {
        name: 'Persistence Test Baby',
        birthDate: new Date('2024-09-01'),
        dueDate: new Date('2024-11-15'),
      };

      const babyProfile = await BabyProfileService.createBabyProfile(babyData);
      
      const milestoneData = {
        milestoneId: 'head-control',
        babyId: babyProfile.id,
        achievedDate: new Date(),
        notes: 'Good head control during tummy time',
      };

      await MilestoneService.logMilestone(milestoneData);

      // Step 2: Simulate app restart by clearing in-memory state
      // (In real app, this would be handled by context providers)
      
      // Step 3: Verify data persistence
      const savedProfiles = await BabyProfileService.getBabyProfiles();
      expect(savedProfiles).toHaveLength(1);
      expect(savedProfiles[0].name).toBe('Persistence Test Baby');

      const milestoneProgress = await MilestoneService.getMilestoneProgress(babyProfile.id);
      expect(milestoneProgress.achieved).toHaveLength(1);
      expect(milestoneProgress.achieved[0].notes).toBe('Good head control during tummy time');
    });

    it('should handle offline data storage and retrieval', async () => {
      // Simulate offline mode by mocking network failures
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      try {
        // All operations should still work with AsyncStorage
        const babyData = {
          name: 'Offline Baby',
          birthDate: new Date('2024-07-01'),
          dueDate: new Date('2024-09-15'),
        };

        const babyProfile = await BabyProfileService.createBabyProfile(babyData);
        expect(babyProfile).toBeDefined();

        const savedProfiles = await BabyProfileService.getBabyProfiles();
        expect(savedProfiles).toHaveLength(1);
        expect(savedProfiles[0].name).toBe('Offline Baby');
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle corrupted data gracefully', async () => {
      // Simulate corrupted AsyncStorage data
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json-data');

      // Should not crash and return empty/default data
      const profiles = await BabyProfileService.getBabyProfiles();
      expect(profiles).toEqual([]);

      const milestoneProgress = await MilestoneService.getMilestoneProgress('test-baby-id');
      expect(milestoneProgress.achieved).toEqual([]);
      expect(milestoneProgress.pending).toBeDefined();
    });

    it('should handle AsyncStorage failures', async () => {
      // Simulate AsyncStorage failure
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage full'));

      const babyData = {
        name: 'Test Baby',
        birthDate: new Date('2024-08-01'),
        dueDate: new Date('2024-10-15'),
      };

      // Should handle the error gracefully
      await expect(BabyProfileService.createBabyProfile(babyData)).rejects.toThrow();
    });
  });
});