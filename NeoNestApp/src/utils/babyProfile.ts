import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string; // ISO string
  dueDate: string; // ISO string
  gender?: 'male' | 'female' | 'other';
  birthWeight?: number; // in grams
  createdAt: string;
  updatedAt: string;
}

const BABY_PROFILES_KEY = 'baby_profiles';

export const saveBabyProfile = async (profile: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<BabyProfile> => {
  try {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const newProfile: BabyProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const existingProfiles = await getBabyProfiles();
    const updatedProfiles = [...existingProfiles, newProfile];
    
    await AsyncStorage.setItem(BABY_PROFILES_KEY, JSON.stringify(updatedProfiles));
    return newProfile;
  } catch (error) {
    console.error('Error saving baby profile:', error);
    throw new Error('Failed to save baby profile');
  }
};

export const getBabyProfiles = async (): Promise<BabyProfile[]> => {
  try {
    const profilesJson = await AsyncStorage.getItem(BABY_PROFILES_KEY);
    return profilesJson ? JSON.parse(profilesJson) : [];
  } catch (error) {
    console.error('Error getting baby profiles:', error);
    return [];
  }
};

export const updateBabyProfile = async (id: string, updates: Partial<BabyProfile>): Promise<BabyProfile> => {
  try {
    const profiles = await getBabyProfiles();
    const profileIndex = profiles.findIndex(p => p.id === id);
    
    if (profileIndex === -1) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...profiles[profileIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    profiles[profileIndex] = updatedProfile;
    await AsyncStorage.setItem(BABY_PROFILES_KEY, JSON.stringify(profiles));
    
    return updatedProfile;
  } catch (error) {
    console.error('Error updating baby profile:', error);
    throw new Error('Failed to update baby profile');
  }
};

export const deleteBabyProfile = async (id: string): Promise<void> => {
  try {
    const profiles = await getBabyProfiles();
    const filteredProfiles = profiles.filter(p => p.id !== id);
    await AsyncStorage.setItem(BABY_PROFILES_KEY, JSON.stringify(filteredProfiles));
  } catch (error) {
    console.error('Error deleting baby profile:', error);
    throw new Error('Failed to delete baby profile');
  }
};

export const getPrimaryBabyProfile = async (): Promise<BabyProfile | null> => {
  try {
    const profiles = await getBabyProfiles();
    // Return the first profile as primary, or null if no profiles exist
    return profiles.length > 0 ? profiles[0] : null;
  } catch (error) {
    console.error('Error getting primary baby profile:', error);
    return null;
  }
};