import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveBabyProfile,
  getBabyProfiles,
  updateBabyProfile,
  deleteBabyProfile,
  getPrimaryBabyProfile,
  BabyProfile,
} from '../src/utils/babyProfile';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Baby Profile Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveBabyProfile', () => {
    it('should save a new baby profile', async () => {
      const profileData = {
        name: 'Emma',
        birthDate: '2024-01-15T00:00:00.000Z',
        dueDate: '2024-03-15T00:00:00.000Z',
        gender: 'female' as const,
        birthWeight: 2500,
      };

      mockAsyncStorage.getItem.mockResolvedValue('[]');
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await saveBabyProfile(profileData);

      expect(result).toMatchObject({
        ...profileData,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'baby_profiles',
        expect.stringContaining(profileData.name)
      );
    });

    it('should add to existing profiles', async () => {
      const existingProfile: BabyProfile = {
        id: '1',
        name: 'Existing Baby',
        birthDate: '2024-01-01T00:00:00.000Z',
        dueDate: '2024-03-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const newProfileData = {
        name: 'New Baby',
        birthDate: '2024-02-15T00:00:00.000Z',
        dueDate: '2024-04-15T00:00:00.000Z',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([existingProfile]));
      mockAsyncStorage.setItem.mockResolvedValue();

      await saveBabyProfile(newProfileData);

      const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
      const savedProfiles = JSON.parse(setItemCall[1]);
      
      expect(savedProfiles).toHaveLength(2);
      expect(savedProfiles[0]).toEqual(existingProfile);
      expect(savedProfiles[1].name).toBe(newProfileData.name);
    });
  });

  describe('getBabyProfiles', () => {
    it('should return empty array when no profiles exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getBabyProfiles();

      expect(result).toEqual([]);
    });

    it('should return existing profiles', async () => {
      const profiles: BabyProfile[] = [
        {
          id: '1',
          name: 'Test Baby',
          birthDate: '2024-01-15T00:00:00.000Z',
          dueDate: '2024-03-15T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(profiles));

      const result = await getBabyProfiles();

      expect(result).toEqual(profiles);
    });
  });

  describe('updateBabyProfile', () => {
    it('should update an existing profile', async () => {
      const existingProfile: BabyProfile = {
        id: '1',
        name: 'Original Name',
        birthDate: '2024-01-15T00:00:00.000Z',
        dueDate: '2024-03-15T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([existingProfile]));
      mockAsyncStorage.setItem.mockResolvedValue();

      const updates = { name: 'Updated Name' };
      const result = await updateBabyProfile('1', updates);

      expect(result.name).toBe('Updated Name');
      expect(result.updatedAt).not.toBe(existingProfile.updatedAt);
    });

    it('should throw error if profile not found', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('[]');

      await expect(updateBabyProfile('nonexistent', { name: 'Test' }))
        .rejects.toThrow('Failed to update baby profile');
    });
  });

  describe('deleteBabyProfile', () => {
    it('should delete an existing profile', async () => {
      const profiles: BabyProfile[] = [
        {
          id: '1',
          name: 'Baby 1',
          birthDate: '2024-01-15T00:00:00.000Z',
          dueDate: '2024-03-15T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Baby 2',
          birthDate: '2024-02-15T00:00:00.000Z',
          dueDate: '2024-04-15T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(profiles));
      mockAsyncStorage.setItem.mockResolvedValue();

      await deleteBabyProfile('1');

      const setItemCall = mockAsyncStorage.setItem.mock.calls[0];
      const remainingProfiles = JSON.parse(setItemCall[1]);
      
      expect(remainingProfiles).toHaveLength(1);
      expect(remainingProfiles[0].id).toBe('2');
    });
  });

  describe('getPrimaryBabyProfile', () => {
    it('should return first profile as primary', async () => {
      const profiles: BabyProfile[] = [
        {
          id: '1',
          name: 'Primary Baby',
          birthDate: '2024-01-15T00:00:00.000Z',
          dueDate: '2024-03-15T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Secondary Baby',
          birthDate: '2024-02-15T00:00:00.000Z',
          dueDate: '2024-04-15T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(profiles));

      const result = await getPrimaryBabyProfile();

      expect(result).toEqual(profiles[0]);
    });

    it('should return null when no profiles exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('[]');

      const result = await getPrimaryBabyProfile();

      expect(result).toBeNull();
    });
  });
});