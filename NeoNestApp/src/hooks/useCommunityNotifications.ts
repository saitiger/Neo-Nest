import {useNotification} from '../contexts/NotificationContext';

/**
 * Hook to manage community-related notifications
 */
export const useCommunityNotifications = () => {
  const {scheduleReminder, preferences} = useNotification();

  const notifyPostReply = async (postId: string, postTitle: string, replyAuthor: string) => {
    if (!preferences?.communityReplies) return;

    try {
      await scheduleReminder('community', {
        postId,
        postTitle,
        replyAuthor,
      });
    } catch (error) {
      console.error('Error scheduling community notification:', error);
    }
  };

  const notifyExpertReply = async (postId: string, postTitle: string, expertName: string) => {
    if (!preferences?.communityReplies) return;

    try {
      await scheduleReminder('community', {
        postId,
        postTitle,
        replyAuthor: `Expert: ${expertName}`,
      });
    } catch (error) {
      console.error('Error scheduling expert reply notification:', error);
    }
  };

  const scheduleExpertSession = async (sessionTitle: string, sessionDate: Date) => {
    if (!preferences?.expertSessions) return;

    try {
      await scheduleReminder('expert', {
        sessionTitle,
        sessionDate,
      });
    } catch (error) {
      console.error('Error scheduling expert session notification:', error);
    }
  };

  return {
    notifyPostReply,
    notifyExpertReply,
    scheduleExpertSession,
  };
};