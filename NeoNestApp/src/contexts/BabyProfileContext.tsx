import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {BabyProfile, getBabyProfiles, saveBabyProfile, updateBabyProfile, deleteBabyProfile, getPrimaryBabyProfile} from '../utils/babyProfile';

interface BabyProfileContextType {
  profiles: BabyProfile[];
  primaryProfile: BabyProfile | null;
  isLoading: boolean;
  createProfile: (profile: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BabyProfile>;
  updateProfile: (id: string, updates: Partial<BabyProfile>) => Promise<BabyProfile>;
  deleteProfile: (id: string) => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const BabyProfileContext = createContext<BabyProfileContextType | undefined>(undefined);

interface BabyProfileProviderProps {
  children: ReactNode;
}

export const BabyProfileProvider: React.FC<BabyProfileProviderProps> = ({children}) => {
  const [profiles, setProfiles] = useState<BabyProfile[]>([]);
  const [primaryProfile, setPrimaryProfile] = useState<BabyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfiles = async () => {
    try {
      setIsLoading(true);
      const allProfiles = await getBabyProfiles();
      const primary = await getPrimaryBabyProfile();
      
      setProfiles(allProfiles);
      setPrimaryProfile(primary);
    } catch (error) {
      console.error('Error refreshing profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<BabyProfile> => {
    try {
      const newProfile = await saveBabyProfile(profileData);
      await refreshProfiles();
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (id: string, updates: Partial<BabyProfile>): Promise<BabyProfile> => {
    try {
      const updatedProfile = await updateBabyProfile(id, updates);
      await refreshProfiles();
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const deleteProfile = async (id: string): Promise<void> => {
    try {
      await deleteBabyProfile(id);
      await refreshProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  const value: BabyProfileContextType = {
    profiles,
    primaryProfile,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    refreshProfiles,
  };

  return (
    <BabyProfileContext.Provider value={value}>
      {children}
    </BabyProfileContext.Provider>
  );
};

export const useBabyProfile = (): BabyProfileContextType => {
  const context = useContext(BabyProfileContext);
  if (context === undefined) {
    throw new Error('useBabyProfile must be used within a BabyProfileProvider');
  }
  return context;
};