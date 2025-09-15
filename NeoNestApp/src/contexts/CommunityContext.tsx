import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ForumPost, ForumReply, CommunityGroup, ForumCategory, mockForumPosts, mockForumReplies, mockCommunityGroups } from '../data/communityData';

interface CommunityContextType {
  // Forum Posts
  posts: ForumPost[];
  selectedPost: ForumPost | null;
  replies: ForumReply[];
  
  // Community Groups
  groups: CommunityGroup[];
  selectedGroup: CommunityGroup | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedCategory: ForumCategory | 'all';
  
  // Actions
  loadPosts: (category?: ForumCategory) => Promise<void>;
  loadPost: (postId: string) => Promise<void>;
  loadReplies: (postId: string) => Promise<void>;
  createPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'replyCount' | 'likeCount' | 'status'>) => Promise<void>;
  createReply: (reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'status'>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  likeReply: (replyId: string) => Promise<void>;
  reportPost: (postId: string, reason: string) => Promise<void>;
  reportReply: (replyId: string, reason: string) => Promise<void>;
  
  // Groups
  loadGroups: () => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  
  // Filters
  setSelectedCategory: (category: ForumCategory | 'all') => void;
  searchPosts: (query: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');

  // Initialize with mock data
  useEffect(() => {
    loadPosts();
    loadGroups();
  }, []);

  const loadPosts = async (category?: ForumCategory) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for now
      let filteredPosts = mockForumPosts;
      if (category) {
        filteredPosts = mockForumPosts.filter(post => post.category === category);
      }
      
      setPosts(filteredPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const post = mockForumPosts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
        await loadReplies(postId);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (postId: string) => {
    try {
      const postReplies = mockForumReplies.filter(reply => reply.postId === postId);
      setReplies(postReplies);
    } catch (err) {
      console.error('Error loading replies:', err);
    }
  };

  const createPost = async (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'replyCount' | 'likeCount' | 'status'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPost: ForumPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        replyCount: 0,
        likeCount: 0,
        status: 'pending' // Requires moderation
      };
      
      // In a real app, this would be sent to the server
      // For now, add to local state (but mark as pending)
      setPosts(prev => [newPost, ...prev]);
      
      // Simulate moderation delay
      setTimeout(() => {
        setPosts(prev => prev.map(post => 
          post.id === newPost.id 
            ? { ...post, status: 'approved' as const, isModerated: true }
            : post
        ));
      }, 2000);
      
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (replyData: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'status'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newReply: ForumReply = {
        ...replyData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        status: 'pending' // Requires moderation
      };
      
      // Add to local state
      setReplies(prev => [...prev, newReply]);
      
      // Update post reply count
      setPosts(prev => prev.map(post => 
        post.id === replyData.postId 
          ? { ...post, replyCount: post.replyCount + 1 }
          : post
      ));
      
      // Simulate moderation approval
      setTimeout(() => {
        setReplies(prev => prev.map(reply => 
          reply.id === newReply.id 
            ? { ...reply, status: 'approved' as const, isModerated: true }
            : reply
        ));
      }, 1500);
      
    } catch (err) {
      setError('Failed to create reply');
      console.error('Error creating reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    try {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
              isLiked: !post.isLiked 
            }
          : post
      ));
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? {
          ...prev,
          likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
          isLiked: !prev.isLiked
        } : null);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const likeReply = async (replyId: string) => {
    try {
      setReplies(prev => prev.map(reply => 
        reply.id === replyId 
          ? { 
              ...reply, 
              likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1,
              isLiked: !reply.isLiked 
            }
          : reply
      ));
    } catch (err) {
      console.error('Error liking reply:', err);
    }
  };

  const reportPost = async (postId: string, reason: string) => {
    try {
      // In a real app, this would send a report to moderators
      console.log(`Reported post ${postId} for: ${reason}`);
      // Could show a success message to user
    } catch (err) {
      console.error('Error reporting post:', err);
    }
  };

  const reportReply = async (replyId: string, reason: string) => {
    try {
      // In a real app, this would send a report to moderators
      console.log(`Reported reply ${replyId} for: ${reason}`);
    } catch (err) {
      console.error('Error reporting reply:', err);
    }
  };

  const loadGroups = async () => {
    try {
      setGroups(mockCommunityGroups);
    } catch (err) {
      console.error('Error loading groups:', err);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, memberCount: group.memberCount + 1 }
          : group
      ));
    } catch (err) {
      console.error('Error joining group:', err);
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
          : group
      ));
    } catch (err) {
      console.error('Error leaving group:', err);
    }
  };

  const searchPosts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        await loadPosts(selectedCategory === 'all' ? undefined : selectedCategory);
        return;
      }
      
      const filteredPosts = mockForumPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setPosts(filteredPosts);
    } catch (err) {
      setError('Failed to search posts');
      console.error('Error searching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const value: CommunityContextType = {
    posts,
    selectedPost,
    replies,
    groups,
    selectedGroup,
    loading,
    error,
    selectedCategory,
    loadPosts,
    loadPost,
    loadReplies,
    createPost,
    createReply,
    likePost,
    likeReply,
    reportPost,
    reportReply,
    loadGroups,
    joinGroup,
    leaveGroup,
    setSelectedCategory,
    searchPosts
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};