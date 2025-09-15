import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MilestoneLog {
  id: string;
  milestoneId: string;
  babyProfileId: string;
  achievedDate: string; // ISO string
  notes?: string;
  mediaUrls?: string[]; // Photo/video URLs
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneProgress {
  milestoneId: string;
  status: 'achieved' | 'in-progress' | 'upcoming' | 'delayed';
  achievedDate?: string;
  notes?: string;
  mediaUrls?: string[];
}

const MILESTONE_LOGS_KEY = 'milestone_logs';

/**
 * Save a milestone achievement log
 */
export const logMilestone = async (
  milestoneId: string,
  babyProfileId: string,
  achievedDate: Date,
  notes?: string,
  mediaUrls?: string[]
): Promise<MilestoneLog> => {
  try {
    const id = `${milestoneId}_${babyProfileId}_${Date.now()}`;
    const now = new Date().toISOString();
    
    const newLog: MilestoneLog = {
      id,
      milestoneId,
      babyProfileId,
      achievedDate: achievedDate.toISOString(),
      notes,
      mediaUrls,
      createdAt: now,
      updatedAt: now,
    };

    const existingLogs = await getMilestoneLogs();
    const updatedLogs = [...existingLogs, newLog];
    
    await AsyncStorage.setItem(MILESTONE_LOGS_KEY, JSON.stringify(updatedLogs));
    return newLog;
  } catch (error) {
    console.error('Error logging milestone:', error);
    throw new Error('Failed to log milestone');
  }
};

/**
 * Get all milestone logs
 */
export const getMilestoneLogs = async (): Promise<MilestoneLog[]> => {
  try {
    const logsJson = await AsyncStorage.getItem(MILESTONE_LOGS_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (error) {
    console.error('Error getting milestone logs:', error);
    return [];
  }
};

/**
 * Get milestone logs for a specific baby
 */
export const getMilestoneLogsForBaby = async (babyProfileId: string): Promise<MilestoneLog[]> => {
  try {
    const allLogs = await getMilestoneLogs();
    return allLogs.filter(log => log.babyProfileId === babyProfileId);
  } catch (error) {
    console.error('Error getting milestone logs for baby:', error);
    return [];
  }
};

/**
 * Get milestone progress for a specific baby
 */
export const getMilestoneProgress = async (babyProfileId: string): Promise<MilestoneProgress[]> => {
  try {
    const logs = await getMilestoneLogsForBaby(babyProfileId);
    
    // Group logs by milestone ID and get the latest log for each milestone
    const progressMap = new Map<string, MilestoneProgress>();
    
    logs.forEach(log => {
      const existing = progressMap.get(log.milestoneId);
      if (!existing || new Date(log.createdAt) > new Date(existing.achievedDate || '')) {
        progressMap.set(log.milestoneId, {
          milestoneId: log.milestoneId,
          status: 'achieved',
          achievedDate: log.achievedDate,
          notes: log.notes,
          mediaUrls: log.mediaUrls,
        });
      }
    });

    return Array.from(progressMap.values());
  } catch (error) {
    console.error('Error getting milestone progress:', error);
    return [];
  }
};

/**
 * Update milestone log
 */
export const updateMilestoneLog = async (
  logId: string,
  updates: Partial<Omit<MilestoneLog, 'id' | 'createdAt'>>
): Promise<MilestoneLog> => {
  try {
    const logs = await getMilestoneLogs();
    const logIndex = logs.findIndex(log => log.id === logId);
    
    if (logIndex === -1) {
      throw new Error('Milestone log not found');
    }

    const updatedLog = {
      ...logs[logIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    logs[logIndex] = updatedLog;
    await AsyncStorage.setItem(MILESTONE_LOGS_KEY, JSON.stringify(logs));
    
    return updatedLog;
  } catch (error) {
    console.error('Error updating milestone log:', error);
    throw new Error('Failed to update milestone log');
  }
};

/**
 * Delete milestone log
 */
export const deleteMilestoneLog = async (logId: string): Promise<void> => {
  try {
    const logs = await getMilestoneLogs();
    const filteredLogs = logs.filter(log => log.id !== logId);
    await AsyncStorage.setItem(MILESTONE_LOGS_KEY, JSON.stringify(filteredLogs));
  } catch (error) {
    console.error('Error deleting milestone log:', error);
    throw new Error('Failed to delete milestone log');
  }
};

/**
 * Generate milestone summary for pediatric visits
 */
export const generateMilestoneSummary = async (babyProfileId: string): Promise<string> => {
  try {
    const progress = await getMilestoneProgress(babyProfileId);
    const achievedMilestones = progress.filter(p => p.status === 'achieved');
    
    let summary = `Milestone Summary\n`;
    summary += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    summary += `Achieved Milestones (${achievedMilestones.length}):\n`;
    
    achievedMilestones
      .sort((a, b) => new Date(a.achievedDate!).getTime() - new Date(b.achievedDate!).getTime())
      .forEach(milestone => {
        const achievedDate = new Date(milestone.achievedDate!).toLocaleDateString();
        summary += `• ${milestone.milestoneId}: ${achievedDate}\n`;
        if (milestone.notes) {
          summary += `  Notes: ${milestone.notes}\n`;
        }
      });

    return summary;
  } catch (error) {
    console.error('Error generating milestone summary:', error);
    throw new Error('Failed to generate milestone summary');
  }
};

/**
 * Export milestone data for sharing with healthcare providers
 */
export const exportMilestoneData = async (babyProfileId: string): Promise<{
  summary: string;
  detailedLogs: MilestoneLog[];
  progress: MilestoneProgress[];
}> => {
  try {
    const [summary, logs, progress] = await Promise.all([
      generateMilestoneSummary(babyProfileId),
      getMilestoneLogsForBaby(babyProfileId),
      getMilestoneProgress(babyProfileId),
    ]);

    return {
      summary,
      detailedLogs: logs,
      progress,
    };
  } catch (error) {
    console.error('Error exporting milestone data:', error);
    throw new Error('Failed to export milestone data');
  }
};