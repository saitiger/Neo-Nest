export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    isExpert: boolean;
    credentials?: string;
    avatar?: string;
  };
  category: ForumCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isModerated: boolean;
  isPinned: boolean;
  replyCount: number;
  likeCount: number;
  isLiked?: boolean;
  status: 'pending' | 'approved' | 'flagged' | 'removed';
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    isExpert: boolean;
    credentials?: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isModerated: boolean;
  likeCount: number;
  isLiked?: boolean;
  parentReplyId?: string; // For threaded replies
  status: 'pending' | 'approved' | 'flagged' | 'removed';
}

export type ForumCategory = 
  | 'general-support'
  | 'feeding-nutrition'
  | 'sleep-routines'
  | 'development-milestones'
  | 'medical-questions'
  | 'emotional-support'
  | 'returning-to-work'
  | 'sibling-support';

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: ForumCategory;
  memberCount: number;
  isPrivate: boolean;
  moderators: string[];
  createdAt: Date;
  lastActivity: Date;
}

export const forumCategories: Array<{
  id: ForumCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}> = [
  {
    id: 'general-support',
    name: 'General Support',
    description: 'General questions and support for preterm parents',
    icon: '🤝',
    color: '#4A90E2'
  },
  {
    id: 'feeding-nutrition',
    name: 'Feeding & Nutrition',
    description: 'Breastfeeding, formula, and solid food discussions',
    icon: '🍼',
    color: '#7ED321'
  },
  {
    id: 'sleep-routines',
    name: 'Sleep & Routines',
    description: 'Sleep training and daily routine strategies',
    icon: '😴',
    color: '#9013FE'
  },
  {
    id: 'development-milestones',
    name: 'Development & Milestones',
    description: 'Milestone tracking and developmental concerns',
    icon: '📈',
    color: '#FF6B35'
  },
  {
    id: 'medical-questions',
    name: 'Medical Questions',
    description: 'Health concerns and medical appointment discussions',
    icon: '🏥',
    color: '#F5A623'
  },
  {
    id: 'emotional-support',
    name: 'Emotional Support',
    description: 'Mental health and emotional wellbeing support',
    icon: '💙',
    color: '#50E3C2'
  },
  {
    id: 'returning-to-work',
    name: 'Returning to Work',
    description: 'Balancing work and preterm baby care',
    icon: '💼',
    color: '#BD10E0'
  },
  {
    id: 'sibling-support',
    name: 'Sibling Support',
    description: 'Managing siblings and family dynamics',
    icon: '👨‍👩‍👧‍👦',
    color: '#B8E986'
  }
];

// Mock data for development
export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'First week home from NICU - feeling overwhelmed',
    content: 'We just brought our 34-week preemie home yesterday and I\'m feeling so anxious about everything. Any tips for the first few days?',
    author: {
      id: 'user1',
      name: 'Sarah M.',
      isExpert: false,
      avatar: '👩'
    },
    category: 'general-support',
    tags: ['nicu-discharge', 'anxiety', 'first-time-parent'],
    createdAt: new Date('2024-12-14T10:30:00Z'),
    updatedAt: new Date('2024-12-14T10:30:00Z'),
    isModerated: true,
    isPinned: false,
    replyCount: 8,
    likeCount: 12,
    status: 'approved'
  },
  {
    id: '2',
    title: 'Corrected age vs chronological age for milestones',
    content: 'My 8-month-old (6 months corrected) isn\'t sitting up yet. Should I be concerned? When did your preemies reach this milestone?',
    author: {
      id: 'user2',
      name: 'Mike T.',
      isExpert: false,
      avatar: '👨'
    },
    category: 'development-milestones',
    tags: ['corrected-age', 'sitting', 'motor-skills'],
    createdAt: new Date('2024-12-13T15:45:00Z'),
    updatedAt: new Date('2024-12-13T15:45:00Z'),
    isModerated: true,
    isPinned: true,
    replyCount: 15,
    likeCount: 23,
    status: 'approved'
  }
];

export const mockForumReplies: ForumReply[] = [
  {
    id: 'reply1',
    postId: '1',
    content: 'The first week is definitely the hardest! Take it one day at a time. Make sure you have your pediatrician\'s contact info handy and don\'t hesitate to call with questions.',
    author: {
      id: 'expert1',
      name: 'Dr. Jennifer Walsh',
      isExpert: true,
      credentials: 'MD, Neonatologist',
      avatar: '👩‍⚕️'
    },
    createdAt: new Date('2024-12-14T11:15:00Z'),
    updatedAt: new Date('2024-12-14T11:15:00Z'),
    isModerated: true,
    likeCount: 8,
    status: 'approved'
  },
  {
    id: 'reply2',
    postId: '1',
    content: 'I remember that feeling! It gets easier, I promise. Having a routine helped me feel more in control. Also, accept help from family and friends.',
    author: {
      id: 'user3',
      name: 'Lisa K.',
      isExpert: false,
      avatar: '👩'
    },
    createdAt: new Date('2024-12-14T12:00:00Z'),
    updatedAt: new Date('2024-12-14T12:00:00Z'),
    isModerated: true,
    likeCount: 5,
    status: 'approved'
  }
];

export const mockCommunityGroups: CommunityGroup[] = [
  {
    id: 'group1',
    name: 'NICU Graduates Support',
    description: 'A supportive community for parents of NICU graduates',
    category: 'general-support',
    memberCount: 1247,
    isPrivate: false,
    moderators: ['expert1', 'mod1'],
    createdAt: new Date('2024-01-15T00:00:00Z'),
    lastActivity: new Date('2024-12-14T14:30:00Z')
  },
  {
    id: 'group2',
    name: 'Preemie Feeding Support',
    description: 'Specialized support for feeding challenges with preterm babies',
    category: 'feeding-nutrition',
    memberCount: 892,
    isPrivate: false,
    moderators: ['expert2', 'mod2'],
    createdAt: new Date('2024-02-01T00:00:00Z'),
    lastActivity: new Date('2024-12-14T13:45:00Z')
  }
];