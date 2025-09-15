import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommunity } from '../contexts/CommunityContext';
import { useAuth } from '../contexts/AuthContext';
import { forumCategories, ForumCategory } from '../data/communityData';

interface CreatePostScreenProps {
  navigation: any;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { createPost } = useCommunity();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory>('general-support');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your post');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter content for your post');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      await createPost({
        title: title.trim(),
        content: content.trim(),
        author: {
          id: user.id,
          name: user.name || 'Anonymous',
          isExpert: user.isExpert || false,
          credentials: user.credentials,
          avatar: user.avatar || '👤'
        },
        category: selectedCategory,
        tags: tagArray,
        isModerated: false,
        isPinned: false
      });

      Alert.alert(
        'Success',
        'Your post has been submitted for moderation and will be visible once approved.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>New Post</Text>
        
        <TouchableOpacity
          style={[styles.submitButton, (!title.trim() || !content.trim() || isSubmitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim() || !content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="What would you like to discuss?"
            value={title}
            onChangeText={setTitle}
            maxLength={200}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forumCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  selectedCategory === category.id && styles.categoryOptionSelected
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Share your thoughts, questions, or experiences..."
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={2000}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Tags (optional)</Text>
          <TextInput
            style={styles.tagsInput}
            placeholder="Add tags separated by commas"
            value={tags}
            onChangeText={setTags}
            maxLength={200}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.moderationNotice}>
          <Text style={styles.moderationTitle}>📋 Moderation Notice</Text>
          <Text style={styles.moderationText}>
            All posts are reviewed by our moderation team before being published. 
            This helps ensure a safe and supportive environment for all parents.
          </Text>
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
  cancelText: {
    fontSize: 16,
    color: '#666'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  form: {
    flex: 1,
    padding: 20
  },
  inputSection: {
    marginBottom: 24
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8
  },
  titleInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50'
  },
  contentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#2c3e50'
  },
  tagsInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50'
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9'
  },
  categoryOptionSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2'
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  categoryTextSelected: {
    color: '#fff'
  },
  moderationNotice: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  moderationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8
  },
  moderationText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20
  }
});

export default CreatePostScreen;