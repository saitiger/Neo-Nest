// Content service for managing content library operations

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ContentItem,
  ContentCategory,
  mockContentData,
  contentCategories,
  searchContent,
  getContentByCategory,
  getContentByAgeRange,
  getBookmarkedContent,
} from '../data/contentData';

const BOOKMARKS_STORAGE_KEY = '@neo_nest_bookmarks';
const CONTENT_PREFERENCES_KEY = '@neo_nest_content_preferences';
const CONTENT_HISTORY_KEY = '@neo_nest_content_history';

export interface ContentPreferences {
  preferredCategories: string[];
  contentTypes: string[];
  difficulty: string[];
  autoBookmarkFavorites: boolean;
}

export interface ContentHistoryItem {
  contentId: string;
  viewedAt: Date;
  timeSpent?: number; // in seconds
  completed?: boolean;
}

export interface ContentSearchFilters {
  categories?: string[];
  ageRange?: number;
  type?: string[];
  difficulty?: string[];
  bookmarkedOnly?: boolean;
}

class ContentService {
  private bookmarkedIds: Set<string> = new Set();
  private contentHistory: ContentHistoryItem[] = [];
  private preferences: ContentPreferences = {
    preferredCategories: [],
    contentTypes: ['article', 'video', 'infographic'],
    difficulty: ['beginner', 'intermediate'],
    autoBookmarkFavorites: false,
  };

  constructor() {
    this.loadBookmarks();
    this.loadPreferences();
    this.loadHistory();
  }

  // Bookmark management
  async loadBookmarks(): Promise<void> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (bookmarksJson) {
        const bookmarks = JSON.parse(bookmarksJson);
        this.bookmarkedIds = new Set(bookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }

  async saveBookmarks(): Promise<void> {
    try {
      const bookmarks = Array.from(this.bookmarkedIds);
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }

  async toggleBookmark(contentId: string): Promise<boolean> {
    const isBookmarked = this.bookmarkedIds.has(contentId);
    
    if (isBookmarked) {
      this.bookmarkedIds.delete(contentId);
    } else {
      this.bookmarkedIds.add(contentId);
    }
    
    await this.saveBookmarks();
    return !isBookmarked;
  }

  isBookmarked(contentId: string): boolean {
    return this.bookmarkedIds.has(contentId);
  }

  getBookmarkedIds(): string[] {
    return Array.from(this.bookmarkedIds);
  }

  // Content preferences
  async loadPreferences(): Promise<void> {
    try {
      const preferencesJson = await AsyncStorage.getItem(CONTENT_PREFERENCES_KEY);
      if (preferencesJson) {
        this.preferences = { ...this.preferences, ...JSON.parse(preferencesJson) };
      }
    } catch (error) {
      console.error('Error loading content preferences:', error);
    }
  }

  async savePreferences(preferences: Partial<ContentPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...preferences };
      await AsyncStorage.setItem(CONTENT_PREFERENCES_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving content preferences:', error);
    }
  }

  getPreferences(): ContentPreferences {
    return { ...this.preferences };
  }

  // Content history
  async loadHistory(): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(CONTENT_HISTORY_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        this.contentHistory = history.map((item: any) => ({
          ...item,
          viewedAt: new Date(item.viewedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading content history:', error);
    }
  }

  async saveHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem(CONTENT_HISTORY_KEY, JSON.stringify(this.contentHistory));
    } catch (error) {
      console.error('Error saving content history:', error);
    }
  }

  async addToHistory(contentId: string, timeSpent?: number, completed?: boolean): Promise<void> {
    // Remove existing entry for this content
    this.contentHistory = this.contentHistory.filter(item => item.contentId !== contentId);
    
    // Add new entry
    this.contentHistory.unshift({
      contentId,
      viewedAt: new Date(),
      timeSpent,
      completed,
    });

    // Keep only last 100 items
    this.contentHistory = this.contentHistory.slice(0, 100);
    
    await this.saveHistory();
  }

  getHistory(): ContentHistoryItem[] {
    return [...this.contentHistory];
  }

  getRecentlyViewed(limit: number = 10): ContentItem[] {
    const recentIds = this.contentHistory
      .slice(0, limit)
      .map(item => item.contentId);
    
    return mockContentData.filter(content => recentIds.includes(content.id));
  }

  // Content retrieval and search
  getAllContent(): ContentItem[] {
    return mockContentData.map(content => ({
      ...content,
      isBookmarked: this.isBookmarked(content.id),
    }));
  }

  getContentById(id: string): ContentItem | undefined {
    const content = mockContentData.find(item => item.id === id);
    if (content) {
      return {
        ...content,
        isBookmarked: this.isBookmarked(content.id),
      };
    }
    return undefined;
  }

  searchContent(query: string, filters: ContentSearchFilters = {}): ContentItem[] {
    let content = this.getAllContent();

    // Apply bookmarked filter first
    if (filters.bookmarkedOnly) {
      content = content.filter(item => item.isBookmarked);
    }

    // Use the search function from contentData
    return searchContent(content, query, {
      categories: filters.categories,
      ageRange: filters.ageRange,
      type: filters.type,
      difficulty: filters.difficulty,
    });
  }

  getContentByCategory(categoryId: string): ContentItem[] {
    const content = this.getAllContent();
    return getContentByCategory(content, categoryId);
  }

  getContentByAgeRange(ageInWeeks: number): ContentItem[] {
    const content = this.getAllContent();
    return getContentByAgeRange(content, ageInWeeks);
  }

  getBookmarkedContent(): ContentItem[] {
    const content = this.getAllContent();
    return getBookmarkedContent(content);
  }

  getCategories(): ContentCategory[] {
    return contentCategories;
  }

  // Personalized recommendations
  getRecommendedContent(correctedAgeWeeks?: number, limit: number = 5): ContentItem[] {
    let content = this.getAllContent();

    // Filter by corrected age if provided
    if (correctedAgeWeeks !== undefined) {
      content = content.filter(item => item.ageRanges.includes(correctedAgeWeeks));
    }

    // Filter by preferred categories
    if (this.preferences.preferredCategories.length > 0) {
      content = content.filter(item =>
        item.categories.some(category => this.preferences.preferredCategories.includes(category))
      );
    }

    // Filter by preferred content types
    content = content.filter(item => this.preferences.contentTypes.includes(item.type));

    // Filter by preferred difficulty
    content = content.filter(item => this.preferences.difficulty.includes(item.difficulty));

    // Sort by view count and recency
    content.sort((a, b) => {
      const aViewed = this.contentHistory.find(h => h.contentId === a.id);
      const bViewed = this.contentHistory.find(h => h.contentId === b.id);
      
      // Prioritize unviewed content
      if (!aViewed && bViewed) return -1;
      if (aViewed && !bViewed) return 1;
      
      // Then by view count
      return (b.viewCount || 0) - (a.viewCount || 0);
    });

    return content.slice(0, limit);
  }

  // Content statistics
  getContentStats(): {
    totalContent: number;
    bookmarkedCount: number;
    viewedCount: number;
    categoryCounts: Record<string, number>;
  } {
    const content = this.getAllContent();
    const categoryCounts: Record<string, number> = {};

    content.forEach(item => {
      item.categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });

    return {
      totalContent: content.length,
      bookmarkedCount: this.bookmarkedIds.size,
      viewedCount: this.contentHistory.length,
      categoryCounts,
    };
  }

  // Clear data methods
  async clearBookmarks(): Promise<void> {
    this.bookmarkedIds.clear();
    await this.saveBookmarks();
  }

  async clearHistory(): Promise<void> {
    this.contentHistory = [];
    await this.saveHistory();
  }

  async clearPreferences(): Promise<void> {
    this.preferences = {
      preferredCategories: [],
      contentTypes: ['article', 'video', 'infographic'],
      difficulty: ['beginner', 'intermediate'],
      autoBookmarkFavorites: false,
    };
    await this.savePreferences(this.preferences);
  }
}

// Export singleton instance
export const contentService = new ContentService();
export default contentService;