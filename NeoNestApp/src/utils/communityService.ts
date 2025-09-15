import AsyncStorage from '@react-native-async-storage/async-storage';
import { ForumPost, ForumReply, CommunityGroup } from '../data/communityData';

const STORAGE_KEYS = {
  FORUM_POSTS: '@neo_nest_forum_posts',
  FORUM_REPLIES: '@neo_nest_forum_replies',
  COMMUNITY_GROUPS: '@neo_nest_community_groups',
  USER_LIKES: '@neo_nest_user_likes',
  USER_GROUPS: '@neo_nest_user_groups'
};

export interface UserLikes {
  posts: string[];
  replies: string[];
}

export interface UserGroups {
  joined: string[];
  moderated: string[];
}

class CommunityService {
  // Forum Posts
  async savePosts(posts: ForumPost[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
      throw new Error('Failed to save posts');
    }
  }

  async loadPosts(): Promise<ForumPost[]> {
    try {
      const postsJson = await AsyncStorage.getItem(STORAGE_KEYS.FORUM_POSTS);
      if (postsJson) {
        const posts = JSON.parse(postsJson);
        // Convert date strings back to Date objects
        return posts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  async savePost(post: ForumPost): Promise<void> {
    try {
      const posts = await this.loadPosts();
      const existingIndex = posts.findIndex(p => p.id === post.id);
      
      if (existingIndex >= 0) {
        posts[existingIndex] = post;
      } else {
        posts.unshift(post);
      }
      
      await this.savePosts(posts);
    } catch (error) {
      console.error('Error saving post:', error);
      throw new Error('Failed to save post');
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const posts = await this.loadPosts();
      const filteredPosts = posts.filter(post => post.id !== postId);
      await this.savePosts(filteredPosts);
      
      // Also delete associated replies
      const replies = await this.loadReplies();
      const filteredReplies = replies.filter(reply => reply.postId !== postId);
      await this.saveReplies(filteredReplies);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post');
    }
  }

  // Forum Replies
  async saveReplies(replies: ForumReply[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FORUM_REPLIES, JSON.stringify(replies));
    } catch (error) {
      console.error('Error saving replies:', error);
      throw new Error('Failed to save replies');
    }
  }

  async loadReplies(): Promise<ForumReply[]> {
    try {
      const repliesJson = await AsyncStorage.getItem(STORAGE_KEYS.FORUM_REPLIES);
      if (repliesJson) {
        const replies = JSON.parse(repliesJson);
        // Convert date strings back to Date objects
        return replies.map((reply: any) => ({
          ...reply,
          createdAt: new Date(reply.createdAt),
          updatedAt: new Date(reply.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading replies:', error);
      return [];
    }
  }

  async saveReply(reply: ForumReply): Promise<void> {
    try {
      const replies = await this.loadReplies();
      const existingIndex = replies.findIndex(r => r.id === reply.id);
      
      if (existingIndex >= 0) {
        replies[existingIndex] = reply;
      } else {
        replies.push(reply);
      }
      
      await this.saveReplies(replies);
    } catch (error) {
      console.error('Error saving reply:', error);
      throw new Error('Failed to save reply');
    }
  }

  async getRepliesForPost(postId: string): Promise<ForumReply[]> {
    try {
      const replies = await this.loadReplies();
      return replies.filter(reply => reply.postId === postId);
    } catch (error) {
      console.error('Error getting replies for post:', error);
      return [];
    }
  }

  // Community Groups
  async saveGroups(groups: CommunityGroup[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY_GROUPS, JSON.stringify(groups));
    } catch (error) {
      console.error('Error saving groups:', error);
      throw new Error('Failed to save groups');
    }
  }

  async loadGroups(): Promise<CommunityGroup[]> {
    try {
      const groupsJson = await AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      if (groupsJson) {
        const groups = JSON.parse(groupsJson);
        // Convert date strings back to Date objects
        return groups.map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          lastActivity: new Date(group.lastActivity)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading groups:', error);
      return [];
    }
  }

  // User Interactions
  async saveUserLikes(likes: UserLikes): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(likes));
    } catch (error) {
      console.error('Error saving user likes:', error);
      throw new Error('Failed to save user likes');
    }
  }

  async loadUserLikes(): Promise<UserLikes> {
    try {
      const likesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_LIKES);
      if (likesJson) {
        return JSON.parse(likesJson);
      }
      return { posts: [], replies: [] };
    } catch (error) {
      console.error('Error loading user likes:', error);
      return { posts: [], replies: [] };
    }
  }

  async togglePostLike(postId: string): Promise<boolean> {
    try {
      const likes = await this.loadUserLikes();
      const isLiked = likes.posts.includes(postId);
      
      if (isLiked) {
        likes.posts = likes.posts.filter(id => id !== postId);
      } else {
        likes.posts.push(postId);
      }
      
      await this.saveUserLikes(likes);
      return !isLiked;
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw new Error('Failed to toggle post like');
    }
  }

  async toggleReplyLike(replyId: string): Promise<boolean> {
    try {
      const likes = await this.loadUserLikes();
      const isLiked = likes.replies.includes(replyId);
      
      if (isLiked) {
        likes.replies = likes.replies.filter(id => id !== replyId);
      } else {
        likes.replies.push(replyId);
      }
      
      await this.saveUserLikes(likes);
      return !isLiked;
    } catch (error) {
      console.error('Error toggling reply like:', error);
      throw new Error('Failed to toggle reply like');
    }
  }

  async saveUserGroups(userGroups: UserGroups): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_GROUPS, JSON.stringify(userGroups));
    } catch (error) {
      console.error('Error saving user groups:', error);
      throw new Error('Failed to save user groups');
    }
  }

  async loadUserGroups(): Promise<UserGroups> {
    try {
      const groupsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_GROUPS);
      if (groupsJson) {
        return JSON.parse(groupsJson);
      }
      return { joined: [], moderated: [] };
    } catch (error) {
      console.error('Error loading user groups:', error);
      return { joined: [], moderated: [] };
    }
  }

  async joinGroup(groupId: string): Promise<void> {
    try {
      const userGroups = await this.loadUserGroups();
      if (!userGroups.joined.includes(groupId)) {
        userGroups.joined.push(groupId);
        await this.saveUserGroups(userGroups);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      throw new Error('Failed to join group');
    }
  }

  async leaveGroup(groupId: string): Promise<void> {
    try {
      const userGroups = await this.loadUserGroups();
      userGroups.joined = userGroups.joined.filter(id => id !== groupId);
      await this.saveUserGroups(userGroups);
    } catch (error) {
      console.error('Error leaving group:', error);
      throw new Error('Failed to leave group');
    }
  }

  // Content Moderation
  async reportContent(contentId: string, contentType: 'post' | 'reply', reason: string): Promise<void> {
    try {
      // In a real app, this would send the report to a moderation system
      const report = {
        contentId,
        contentType,
        reason,
        reportedAt: new Date().toISOString(),
        userId: 'current-user-id' // Would get from auth context
      };
      
      console.log('Content reported:', report);
      
      // Could store reports locally for offline support
      const reportsKey = '@neo_nest_content_reports';
      const existingReports = await AsyncStorage.getItem(reportsKey);
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(report);
      await AsyncStorage.setItem(reportsKey, JSON.stringify(reports));
      
    } catch (error) {
      console.error('Error reporting content:', error);
      throw new Error('Failed to report content');
    }
  }

  // Search and Filtering
  async searchPosts(query: string, category?: string): Promise<ForumPost[]> {
    try {
      const posts = await this.loadPosts();
      const searchTerm = query.toLowerCase();
      
      let filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.author.name.toLowerCase().includes(searchTerm)
      );
      
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      return filteredPosts;
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  // Clear all community data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.FORUM_POSTS),
        AsyncStorage.removeItem(STORAGE_KEYS.FORUM_REPLIES),
        AsyncStorage.removeItem(STORAGE_KEYS.COMMUNITY_GROUPS),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_LIKES),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_GROUPS)
      ]);
    } catch (error) {
      console.error('Error clearing community data:', error);
      throw new Error('Failed to clear community data');
    }
  }
}

export const communityService = new CommunityService();