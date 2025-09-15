import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommunity } from '../contexts/CommunityContext';
import { useAuth } from '../contexts/AuthContext';
import { forumCategories } from '../data/communityData';

interface PostDetailScreenProps {
  navigation: any;
  route: {
    params: {
      postId: string;
    };
  };
}

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ navigation, route }) => {
  const { postId } = route.params;
  const { user } = useAuth();
  const {
    selectedPost,
    replies,
    loading,
    error,
    loadPost,
    createReply,
    likePost,
    likeReply,
    reportPost,
    reportReply
  } = useCommunity();

  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPost(postId);
  }, [postId]);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to reply');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReply({
        postId,
        content: replyText.trim(),
        author: {
          id: user.id,
          name: user.name || 'Anonymous',
          isExpert: user.isExpert || false,
          credentials: user.credentials,
          avatar: user.avatar || '👤'
        },
        isModerated: false
      });
      
      setReplyText('');
      Alert.alert('Success', 'Your reply has been submitted for moderation');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
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

  if (loading && !selectedPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !selectedPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Post not found'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const category = forumCategories.find(cat => cat.id === selectedPost.category);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <View style={styles.postAuthor}>
                <Text style={styles.authorAvatar}>{selectedPost.author.avatar}</Text>
                <View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{selectedPost.author.name}</Text>
                    {selectedPost.author.isExpert && (
                      <View style={styles.expertBadge}>
                        <Text style={styles.expertBadgeText}>Expert</Text>
                      </View>
                    )}
                  </View>
                  {selectedPost.author.credentials && (
                    <Text style={styles.authorCredentials}>
                      {selectedPost.author.credentials}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.postTime}>{formatTimeAgo(selectedPost.createdAt)}</Text>
            </View>

            <Text style={styles.postTitle}>{selectedPost.title}</Text>
            <Text style={styles.postContent}>{selectedPost.content}</Text>

            <View style={styles.postFooter}>
              <View style={styles.postCategory}>
                <Text style={styles.categoryIcon}>{category?.icon}</Text>
                <Text style={styles.categoryName}>{category?.name}</Text>
              </View>
              
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => likePost(selectedPost.id)}
                >
                  <Text style={[
                    styles.likeButtonText,
                    selectedPost.isLiked && styles.likeButtonTextActive
                  ]}>
                    ❤️ {selectedPost.likeCount}
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.replyCount}>💬 {selectedPost.replyCount}</Text>
              </View>
            </View>
          </View>

          <View style={styles.repliesSection}>
            <Text style={styles.repliesTitle}>
              Replies ({replies.length})
            </Text>
            
            {replies.length === 0 ? (
              <View style={styles.noRepliesContainer}>
                <Text style={styles.noRepliesText}>No replies yet</Text>
                <Text style={styles.noRepliesSubtext}>Be the first to reply!</Text>
              </View>
            ) : (
              replies.map((reply) => (
                <View key={reply.id} style={styles.replyItem}>
                  <View style={styles.replyHeader}>
                    <View style={styles.replyAuthor}>
                      <Text style={styles.authorAvatar}>{reply.author.avatar}</Text>
                      <View>
                        <View style={styles.authorInfo}>
                          <Text style={styles.authorName}>{reply.author.name}</Text>
                          {reply.author.isExpert && (
                            <View style={styles.expertBadge}>
                              <Text style={styles.expertBadgeText}>Expert</Text>
                            </View>
                          )}
                        </View>
                        {reply.author.credentials && (
                          <Text style={styles.authorCredentials}>{reply.author.credentials}</Text>
                        )}
                      </View>
                    </View>
                    <Text style={styles.replyTime}>{formatTimeAgo(reply.createdAt)}</Text>
                  </View>

                  <Text style={styles.replyContent}>{reply.content}</Text>

                  <View style={styles.replyFooter}>
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={() => likeReply(reply.id)}
                    >
                      <Text style={[
                        styles.likeButtonText,
                        reply.isLiked && styles.likeButtonTextActive
                      ]}>
                        ❤️ {reply.likeCount}
                      </Text>
                    </TouchableOpacity>

                    {reply.status === 'pending' && (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingText}>⏳ Pending</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            value={replyText}
            onChangeText={setReplyText}
            multiline
            maxLength={1000}
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!replyText.trim() || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitReply}
            disabled={!replyText.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  backButton: {
    paddingVertical: 8
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    flex: 1
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  authorAvatar: {
    fontSize: 40,
    marginRight: 12
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorName: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  postTime: {
    fontSize: 14,
    color: '#999'
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    lineHeight: 28
  },
  postContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16
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
  categoryIcon: {
    fontSize: 16,
    marginRight: 6
  },
  categoryName: {
    fontSize: 14,
    color: '#666'
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12
  },
  likeButtonText: {
    fontSize: 14,
    color: '#666'
  },
  likeButtonTextActive: {
    color: '#e74c3c'
  },
  replyCount: {
    fontSize: 14,
    color: '#666'
  },
  repliesSection: {
    backgroundColor: '#fff',
    paddingTop: 20
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  replyItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  replyAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  replyTime: {
    fontSize: 12,
    color: '#999'
  },
  replyContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12
  },
  replyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pendingBadge: {
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
  noRepliesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  noRepliesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8
  },
  noRepliesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9'
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    color: '#2c3e50'
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
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

export default PostDetailScreen;