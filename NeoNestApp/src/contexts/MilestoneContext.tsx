import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {
  MilestoneLog,
  MilestoneProgress,
  logMilestone,
  getMilestoneProgress,
  getMilestoneLogsForBaby,
  updateMilestoneLog,
  deleteMilestoneLog,
  exportMilestoneData,
} from '../utils/milestoneLogging';
import {useBabyProfile} from './BabyProfileContext';

interface MilestoneContextType {
  milestoneProgress: MilestoneProgress[];
  milestoneLogs: MilestoneLog[];
  isLoading: boolean;
  logMilestoneAchievement: (
    milestoneId: string,
    achievedDate: Date,
    notes?: string,
    mediaUrls?: string[]
  ) => Promise<MilestoneLog>;
  updateMilestone: (logId: string, updates: Partial<MilestoneLog>) => Promise<MilestoneLog>;
  deleteMilestone: (logId: string) => Promise<void>;
  exportData: () => Promise<{
    summary: string;
    detailedLogs: MilestoneLog[];
    progress: MilestoneProgress[];
  }>;
  refreshMilestones: () => Promise<void>;
  getMilestoneStatus: (milestoneId: string) => 'achieved' | 'in-progress' | 'upcoming' | 'delayed';
}

const MilestoneContext = createContext<MilestoneContextType | undefined>(undefined);

interface MilestoneProviderProps {
  children: ReactNode;
}

export const MilestoneProvider: React.FC<MilestoneProviderProps> = ({children}) => {
  const {primaryProfile} = useBabyProfile();
  const [milestoneProgress, setMilestoneProgress] = useState<MilestoneProgress[]>([]);
  const [milestoneLogs, setMilestoneLogs] = useState<MilestoneLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMilestones = async () => {
    if (!primaryProfile) {
      setMilestoneProgress([]);
      setMilestoneLogs([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [progress, logs] = await Promise.all([
        getMilestoneProgress(primaryProfile.id),
        getMilestoneLogsForBaby(primaryProfile.id),
      ]);
      
      setMilestoneProgress(progress);
      setMilestoneLogs(logs);
    } catch (error) {
      console.error('Error refreshing milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logMilestoneAchievement = async (
    milestoneId: string,
    achievedDate: Date,
    notes?: string,
    mediaUrls?: string[]
  ): Promise<MilestoneLog> => {
    if (!primaryProfile) {
      throw new Error('No baby profile selected');
    }

    try {
      const newLog = await logMilestone(
        milestoneId,
        primaryProfile.id,
        achievedDate,
        notes,
        mediaUrls
      );
      await refreshMilestones();
      return newLog;
    } catch (error) {
      console.error('Error logging milestone achievement:', error);
      throw error;
    }
  };

  const updateMilestone = async (
    logId: string,
    updates: Partial<MilestoneLog>
  ): Promise<MilestoneLog> => {
    try {
      const updatedLog = await updateMilestoneLog(logId, updates);
      await refreshMilestones();
      return updatedLog;
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  };

  const deleteMilestone = async (logId: string): Promise<void> => {
    try {
      await deleteMilestoneLog(logId);
      await refreshMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  };

  const exportData = async () => {
    if (!primaryProfile) {
      throw new Error('No baby profile selected');
    }

    try {
      return await exportMilestoneData(primaryProfile.id);
    } catch (error) {
      console.error('Error exporting milestone data:', error);
      throw error;
    }
  };

  const getMilestoneStatus = (milestoneId: string): 'achieved' | 'in-progress' | 'upcoming' | 'delayed' => {
    const progress = milestoneProgress.find(p => p.milestoneId === milestoneId);
    return progress?.status || 'upcoming';
  };

  useEffect(() => {
    refreshMilestones();
  }, [primaryProfile]);

  const value: MilestoneContextType = {
    milestoneProgress,
    milestoneLogs,
    isLoading,
    logMilestoneAchievement,
    updateMilestone,
    deleteMilestone,
    exportData,
    refreshMilestones,
    getMilestoneStatus,
  };

  return (
    <MilestoneContext.Provider value={value}>
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestone = (): MilestoneContextType => {
  const context = useContext(MilestoneContext);
  if (context === undefined) {
    throw new Error('useMilestone must be used within a MilestoneProvider');
  }
  return context;
};