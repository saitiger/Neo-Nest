import { communityService } from '../src/utils/communityService';
import { ForumPost, ForumReply } from '../src/data/communityData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Community Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(communityService).toBeDefined();
  });

  const mockPost: ForumPost = {
    id: '1',
    title: 'Test Post',
    content: 'This is a test post content',
    author: {
      id: 'user1',
      name: 'Test User',
      isExpert: false,
      avatar: '👤'
    },
    category: 'general-support',
    tags: ['test', 'support'],
    createdAt: new Date('2024-12-15T10:00:00Z'),
    updatedAt: new Date('2024-12-15T10:00:00Z'),
    isModerated: true,
    isPinned: false,
    replyCount: 0,
    likeCount: 0,
    status: 'approved'
  };

  describe('Forum Posts', () => {
    it('should save posts to AsyncStorage', async () => {
      mockAsyncStorage.setItem.mockResolvedValue();

      await communityService.savePosts([mockPost]);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@neo_nest_forum_posts',
        JSON.stringify([mockPost])
      );
    });

    it('should load posts from AsyncStorage', async () => {
      const postsJson = JSON.stringify([mockPost]);
      mockAsyncStorage.getItem.mockResolvedValue(postsJson);

      const posts = await communityService.loadPosts();

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Test Post');
      expect(posts[0].createdAt).toBeInstanceOf(Date);
    });

    it('should return empty array when no posts exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const posts = await communityService.loadPosts();

      expect(posts).toEqual([]);
    });
  });

  describe('User Interactions', () => {
    it('should toggle post like', async () => {
      const userLikes = { posts: [], replies: [] };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(userLikes));
      mockAsyncStorage.setItem.mockResolvedValue();

      const isLiked = await communityService.togglePostLike('post1');

      expect(isLiked).toBe(true);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@neo_nest_user_likes',
        JSON.stringify({ posts: ['post1'], replies: [] })
      );
    });

    it('should join group', async () => {
      const userGroups = { joined: [], moderated: [] };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(userGroups));
      mockAsyncStorage.setItem.mockResolvedValue();

      await communityService.joinGroup('group1');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@neo_nest_user_groups',
        JSON.stringify({ joined: ['group1'], moderated: [] })
      );
    });
  });

  describe('Search and Filtering', () => {
    const mockPosts: ForumPost[] = [
      {
        id: '1',
        title: 'NICU Discharge Tips',
        content: 'Here are some tips for NICU discharge',
        author: { id: 'user1', name: 'Sarah', isExpert: false, avatar: '👩' },
        category: 'general-support',
        tags: ['nicu', 'discharge', 'tips'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isModerated: true,
        isPinned: false,
        replyCount: 5,
        likeCount: 10,
        status: 'approved'
      }
    ];

    it('should search posts by title', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockPosts));

      const results = await communityService.searchPosts('NICU');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('NICU Discharge Tips');
    });
  });
});