/**
 * API Integration System Tests
 * Tests external service connections and API integrations
 */

import { authService } from '../../src/utils/auth';
import { communityService } from '../../src/utils/communityService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock API responses for system testing
const mockApiResponses = {
  auth: {
    login: {
      success: {
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          parentName: 'Test Parent',
        },
      },
      error: {
        message: 'Invalid credentials',
        code: 'AUTH_FAILED',
      },
    },
    refresh: {
      success: {
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token',
      },
    },
  },
  community: {
    posts: [
      {
        id: 'post-1',
        title: 'Test Post',
        content: 'Test content',
        authorId: 'user-123',
        category: 'General',
        createdAt: new Date().toISOString(),
        moderationStatus: 'approved',
      },
    ],
  },
};

// Mock fetch for API testing
global.fetch = jest.fn();

describe('API Integration System Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('Authentication API Integration', () => {
    it('should handle successful login flow', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.auth.login.success,
      });

      const result = await authService.login('test@example.com', 'password123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('test@example.com');
    });

    it('should handle authentication failures gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockApiResponses.auth.login.error,
      });

      const result = await authService.login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should handle network failures', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.login('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle token refresh flow', async () => {
      // Set up existing tokens
      await AsyncStorage.setItem('authToken', 'expired-token');
      await AsyncStorage.setItem('refreshToken', 'valid-refresh-token');

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.auth.refresh.success,
      });

      const result = await authService.refreshToken();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-refresh-token',
          }),
        })
      );

      expect(result.success).toBe(true);
    });
  });

  describe('Community API Integration', () => {
    beforeEach(async () => {
      // Set up authenticated state
      await AsyncStorage.setItem('authToken', 'valid-token');
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        id: 'user-123',
        email: 'test@example.com',
      }));
    });

    it('should fetch community posts successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ posts: mockApiResponses.community.posts }),
      });

      const posts = await communityService.getPosts();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/community/posts'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-token',
          }),
        })
      );

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Test Post');
    });

    it('should handle post creation with moderation', async () => {
      const newPost = {
        title: 'New Test Post',
        content: 'New test content',
        category: 'General',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...newPost,
          id: 'post-2',
          moderationStatus: 'pending',
        }),
      });

      const result = await communityService.createPost(newPost);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/community/posts'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newPost),
        })
      );

      expect(result.moderationStatus).toBe('pending');
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should retry failed requests with exponential backoff', async () => {
      // First two calls fail, third succeeds
      (fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponses.auth.login.success,
        });

      const result = await authService.login('test@example.com', 'password123');

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(true);
    });

    it('should handle rate limiting gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([['Retry-After', '60']]),
        json: async () => ({ error: 'Rate limit exceeded' }),
      });

      const result = await authService.login('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rate limit');
    });

    it('should handle server errors with appropriate fallbacks', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      const posts = await communityService.getPosts();

      // Should return cached/offline data or empty array
      expect(Array.isArray(posts)).toBe(true);
    });
  });

  describe('Data Synchronization', () => {
    it('should sync local data with server on connection restore', async () => {
      // Simulate offline data creation
      const offlinePost = {
        id: 'offline-post-1',
        title: 'Offline Post',
        content: 'Created while offline',
        category: 'General',
        isOffline: true,
      };

      await communityService.createPost(offlinePost);

      // Simulate connection restore
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...offlinePost,
          id: 'synced-post-1',
          isOffline: false,
        }),
      });

      const syncResult = await communityService.syncOfflineData();

      expect(syncResult.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/community/posts'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('Security Integration', () => {
    it('should include proper security headers in API requests', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponses.auth.login.success,
      });

      await authService.login('test@example.com', 'password123');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          }),
        })
      );
    });

    it('should handle token expiration and automatic refresh', async () => {
      // Set up expired token
      await AsyncStorage.setItem('authToken', 'expired-token');
      await AsyncStorage.setItem('refreshToken', 'valid-refresh-token');

      // First call fails with 401, refresh succeeds, retry succeeds
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Token expired' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponses.auth.refresh.success,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ posts: mockApiResponses.community.posts }),
        });

      const posts = await communityService.getPosts();

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(posts).toHaveLength(1);
    });
  });
});