export const CommunityService = {
  createPost: jest.fn().mockResolvedValue({
    id: 'test-post-1',
    title: 'Test Post',
    content: 'Test content',
    category: 'general',
    authorId: 'test-user-1',
    moderationStatus: 'pending',
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getPost: jest.fn().mockResolvedValue({
    id: 'test-post-1',
    title: 'Test Post',
    content: 'Test content',
    replies: [],
  }),
  addReply: jest.fn().mockResolvedValue({
    id: 'test-reply-1',
    postId: 'test-post-1',
    content: 'Test reply',
    authorId: 'test-user-2',
    isExpertReply: false,
  }),
  moderatePost: jest.fn().mockResolvedValue({
    id: 'test-post-1',
    moderationStatus: 'approved',
  }),
  getPosts: jest.fn().mockResolvedValue([]),
  likePost: jest.fn().mockResolvedValue(true),
};