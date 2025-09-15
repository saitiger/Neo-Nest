import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommunity } from '../contexts/CommunityContext';
import { forumCategories, ForumCategory } from '../data/communityData';

interface CommunityScreenProps {
  navigation: any;
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ navigation }) => {
  const {
    posts,
    groups,
    loading,
    error,
    selectedCategory,
    loadPosts,
    loadGroups,
    setSelectedCategory,
    searchPosts
  } = useCommunity();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
    loadGroups();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadPosts(selectedCategory === 'all' ? undefined : selectedCategory),
        loadGroups()
      ]);
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchPosts(query);
    } else {
      await loadPosts(selectedCategory === 'all' ? undefined : selectedCategory);
    }
  };

  const handleCategorySelect = async (category: ForumCategory | 'all') => {
    setSelectedCategory(category);
    setSearchQuery('');
    await loadPosts(category === 'all' ? undefined : category);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const renderCategoryTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryTabs}
      contentContainerStyle={styles.categoryTabsContent}
    >
      <TouchableOpacity
        style={[
          styles.categoryTab,
          selectedCategory === 'all' && styles.categoryTabActive
        ]}
        onPress={() => handleCategorySelect('all')}
      >
        <Text style={[
          styles.categoryTabText,
          selectedCategory === 'all' && styles.categoryTabTextActive
        ]}>
          All
        </Text>
      </TouchableOpacity>
      
      {forumCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryTab,
            selectedCategory === category.id && styles.categoryTabActive
          ]}
          onPress={() => handleCategorySelect(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[
            styles.categoryTabText,
            selectedCategory === category.id && styles.categoryTabTextActive
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPostItem = (post: any) => {
    const category = forumCategories.find(cat => cat.id === post.category);
    
    return (
      <TouchableOpacity
        key={post.id}
        style={styles.postItem}
        onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
      >
        <View style={styles.postHeader}>
          <View style={styles.postAuthor}>
            <Text style={styles.authorAvatar}>{post.author.avatar}</Text>
            <View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author.name}</Text>
                {post.author.isExpert && (
                  <View style={styles.expertBadge}>
                    <Text style={styles.expertBadgeText}>Expert</Text>
                  </View>
                )}
              </View>
              {post.author.credentials && (
                <Text style={styles.authorCredentials}>{post.author.credentials}</Text>
              )}
            </View>
          </View>
          <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
        </View>

        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent} numberOfLines={3}>
          {post.content}
        </Text>

        <View style={styles.postFooter}>
          <View style={styles.postCategory}>
            <Text style={styles.categoryIcon}>{category?.icon}</Text>
            <Text style={styles.categoryName}>{category?.name}</Text>
          </View>
          
          <View style={styles.postStats}>
            <Text style={styles.statText}>💬 {post.replyCount}</Text>
            <Text style={styles.statText}>❤️ {post.likeCount}</Text>
          </View>
        </View>

        {post.isPinned && (
          <View style={styles.pinnedBadge}>
            <Text style={styles.pinnedText}>📌 Pinned</Text>
          </View>
        )}

        {post.status === 'pending' && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>⏳ Pending Moderation</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCommunityGroups = () => (
    <View style={styles.groupsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Groups</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CommunityGroups')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {groups.slice(0, 3).map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
          >
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.memberCount} members</Text>
            <Text style={styles.groupDescription} numberOfLines={2}>
              {group.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Text style={styles.newPostButtonText}>+ New Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts, topics, or users..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>

      {renderCategoryTabs()}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderCommunityGroups()}

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Recent Discussions</Text>
          
          {loading && posts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'Be the first to start a discussion!'}
              </Text>
            </View>
          ) : (
            posts.map(renderPostItem)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  newPostButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  newPostButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff'
  },
  searchInput: {
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50'
  },
  categoryTabs: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9'
  },
  categoryTabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f1f3f4'
  },
  categoryTabActive: {
    backgroundColor: '#4A90E2'
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  categoryTabTextActive: {
    color: '#fff'
  },
  content: {
    flex: 1
  },
  groupsSection: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  seeAllText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500'
  },
  groupCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    width: 200,
    borderWidth: 1,
    borderColor: '#e1e5e9'
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4
  },
  groupMembers: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8
  },
  groupDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18
  },
  postsSection: {
    backgroundColor: '#fff',
    paddingTop: 16
  },
  postItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  authorAvatar: {
    fontSize: 32,
    marginRight: 12
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 8
  },
  expertBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  expertBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  authorCredentials: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  postTime: {
    fontSize: 12,
    color: '#999'
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 24
  },
  postContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  postCategory: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12
  },
  pinnedBadge: {
    position: 'absolute',
    top: 16,
    right: 20,
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  pinnedText: {
    fontSize: 10,
    color: '#B8860B',
    fontWeight: 'bold'
  },
  pendingBadge: {
    position: 'absolute',
    top: 16,
    right: 20,
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  pendingText: {
    fontSize: 10,
    color: '#856404',
    fontWeight: 'bold'
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});

export default CommunityScreen;