// Content context for managing content library state

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ContentItem,
  ContentCategory,
} from '../data/contentData';
import contentService, {
  ContentPreferences,
  ContentHistoryItem,
  ContentSearchFilters,
} from '../utils/contentService';
import { useBabyProfile } from './BabyProfileContext';

interface ContentContextType {
  // Content data
  allContent: ContentItem[];
  categories: ContentCategory[];
  bookmarkedContent: ContentItem[];
  recentlyViewed: ContentItem[];
  recommendedContent: ContentItem[];
  
  // Search and filtering
  searchResults: ContentItem[];
  searchQuery: string;
  searchFilters: ContentSearchFilters;
  isSearching: boolean;
  
  // User preferences and history
  preferences: ContentPreferences;
  history: ContentHistoryItem[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  searchContent: (query: string, filters?: ContentSearchFilters) => Promise<void>;
  clearSearch: () => void;
  getContentById: (id: string) => ContentItem | undefined;
  toggleBookmark: (contentId: string) => Promise<boolean>;
  addToHistory: (contentId: string, timeSpent?: number, completed?: boolean) => Promise<void>;
  updatePreferences: (preferences: Partial<ContentPreferences>) => Promise<void>;
  getContentByCategory: (categoryId: string) => ContentItem[];
  getContentByAgeRange: (ageInWeeks: number) => ContentItem[];
  refreshContent: () => Promise<void>;
  
  // Statistics
  getContentStats: () => {
    totalContent: number;
    bookmarkedCount: number;
    viewedCount: number;
    categoryCounts: Record<string, number>;
  };
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const { primaryProfile } = useBabyProfile();
  
  // State
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [bookmarkedContent, setBookmarkedContent] = useState<ContentItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<ContentItem[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<ContentSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  
  const [preferences, setPreferences] = useState<ContentPreferences>({
    preferredCategories: [],
    contentTypes: ['article', 'video', 'infographic'],
    difficulty: ['beginner', 'intermediate'],
    autoBookmarkFavorites: false,
  });
  const [history, setHistory] = useState<ContentHistoryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize content data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update recommendations when baby profile changes
  useEffect(() => {
    if (primaryProfile) {
      updateRecommendations();
    }
  }, [primaryProfile]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load all content data
      const content = contentService.getAllContent();
      const cats = contentService.getCategories();
      const bookmarked = contentService.getBookmarkedContent();
      const recent = contentService.getRecentlyViewed(10);
      const prefs = contentService.getPreferences();
      const hist = contentService.getHistory();

      setAllContent(content);
      setCategories(cats);
      setBookmarkedContent(bookmarked);
      setRecentlyViewed(recent);
      setPreferences(prefs);
      setHistory(hist);

      // Load initial recommendations
      updateRecommendations();
    } catch (err) {
      console.error('Error loading content data:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecommendations = () => {
    try {
      const correctedAge = primaryProfile?.correctedAgeWeeks;
      const recommended = contentService.getRecommendedContent(correctedAge, 10);
      setRecommendedContent(recommended);
    } catch (err) {
      console.error('Error updating recommendations:', err);
    }
  };

  const searchContent = async (query: string, filters: ContentSearchFilters = {}) => {
    try {
      setIsSearching(true);
      setError(null);
      setSearchQuery(query);
      setSearchFilters(filters);

      const results = contentService.searchContent(query, filters);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching content:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFilters({});
    setSearchResults([]);
    setIsSearching(false);
  };

  const getContentById = (id: string): ContentItem | undefined => {
    return contentService.getContentById(id);
  };

  const toggleBookmark = async (contentId: string): Promise<boolean> => {
    try {
      const isBookmarked = await contentService.toggleBookmark(contentId);
      
      // Update local state
      const updatedContent = contentService.getAllContent();
      const updatedBookmarked = contentService.getBookmarkedContent();
      
      setAllContent(updatedContent);
      setBookmarkedContent(updatedBookmarked);
      
      // Update search results if they exist
      if (searchResults.length > 0) {
        const updatedSearchResults = searchResults.map(item =>
          item.id === contentId ? { ...item, isBookmarked } : item
        );
        setSearchResults(updatedSearchResults);
      }
      
      return isBookmarked;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setError('Failed to update bookmark. Please try again.');
      return false;
    }
  };

  const addToHistory = async (contentId: string, timeSpent?: number, completed?: boolean) => {
    try {
      await contentService.addToHistory(contentId, timeSpent, completed);
      
      // Update local state
      const updatedHistory = contentService.getHistory();
      const updatedRecent = contentService.getRecentlyViewed(10);
      
      setHistory(updatedHistory);
      setRecentlyViewed(updatedRecent);
      
      // Update recommendations based on new history
      updateRecommendations();
    } catch (err) {
      console.error('Error adding to history:', err);
    }
  };

  const updatePreferences = async (newPreferences: Partial<ContentPreferences>) => {
    try {
      await contentService.savePreferences(newPreferences);
      
      const updatedPreferences = contentService.getPreferences();
      setPreferences(updatedPreferences);
      
      // Update recommendations based on new preferences
      updateRecommendations();
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences. Please try again.');
    }
  };

  const getContentByCategory = (categoryId: string): ContentItem[] => {
    return contentService.getContentByCategory(categoryId);
  };

  const getContentByAgeRange = (ageInWeeks: number): ContentItem[] => {
    return contentService.getContentByAgeRange(ageInWeeks);
  };

  const refreshContent = async () => {
    await loadInitialData();
  };

  const getContentStats = () => {
    return contentService.getContentStats();
  };

  const contextValue: ContentContextType = {
    // Content data
    allContent,
    categories,
    bookmarkedContent,
    recentlyViewed,
    recommendedContent,
    
    // Search and filtering
    searchResults,
    searchQuery,
    searchFilters,
    isSearching,
    
    // User preferences and history
    preferences,
    history,
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    searchContent,
    clearSearch,
    getContentById,
    toggleBookmark,
    addToHistory,
    updatePreferences,
    getContentByCategory,
    getContentByAgeRange,
    refreshContent,
    getContentStats,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentContext;