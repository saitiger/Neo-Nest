import {useEffect} from 'react';
import {useBabyProfile} from '../contexts/BabyProfileContext';
import {useNotification} from '../contexts/NotificationContext';
import {calculateCorrectedAge} from '../utils/correctedAge';
import {getMilestonesForAge} from '../data/milestones';

/**
 * Hook to manage milestone-related notifications
 */
export const useMilestoneNotifications = () => {
  const {primaryProfile} = useBabyProfile();
  const {scheduleReminder, preferences} = useNotification();

  useEffect(() => {
    if (primaryProfile && preferences?.milestoneReminders) {
      scheduleUpcomingMilestoneReminders();
    }
  }, [primaryProfile, preferences?.milestoneReminders]);

  const scheduleUpcomingMilestoneReminders = async () => {
    if (!primaryProfile) return;

    try {
      const birthDate = new Date(primaryProfile.birthDate);
      const dueDate = new Date(primaryProfile.dueDate);
      const correctedAge = calculateCorrectedAge(birthDate, dueDate);
      
      // Get milestones for current and next age ranges
      const currentMilestones = getMilestonesForAge(correctedAge.correctedAgeInWeeks);
      const nextWeekMilestones = getMilestonesForAge(correctedAge.correctedAgeInWeeks + 1);
      
      // Schedule reminders for upcoming milestones
      const upcomingMilestones = [...currentMilestones, ...nextWeekMilestones];
      
      for (const milestone of upcomingMilestones) {
        await scheduleReminder('milestone', {
          milestoneId: milestone.id,
          milestoneName: milestone.title,
          correctedAgeWeeks: correctedAge.correctedAgeInWeeks,
        });
      }
    } catch (error) {
      console.error('Error scheduling milestone reminders:', error);
    }
  };

  const scheduleMilestoneAchievementReminder = async (milestoneId: string, milestoneName: string) => {
    if (!primaryProfile || !preferences?.milestoneReminders) return;

    try {
      const birthDate = new Date(primaryProfile.birthDate);
      const dueDate = new Date(primaryProfile.dueDate);
      const correctedAge = calculateCorrectedAge(birthDate, dueDate);

      await scheduleReminder('milestone', {
        milestoneId,
        milestoneName,
        correctedAgeWeeks: correctedAge.correctedAgeInWeeks,
      });
    } catch (error) {
      console.error('Error scheduling milestone achievement reminder:', error);
    }
  };

  const scheduleWeeklyProgressCheck = async () => {
    if (!primaryProfile || !preferences?.weeklyProgress) return;

    try {
      const birthDate = new Date(primaryProfile.birthDate);
      const dueDate = new Date(primaryProfile.dueDate);
      const correctedAge = calculateCorrectedAge(birthDate, dueDate);

      await scheduleReminder('progress', {
        babyName: primaryProfile.name || 'Your baby',
        correctedAge: correctedAge.displayText,
      });
    } catch (error) {
      console.error('Error scheduling weekly progress check:', error);
    }
  };

  return {
    scheduleUpcomingMilestoneReminders,
    scheduleMilestoneAchievementReminder,
    scheduleWeeklyProgressCheck,
  };
};