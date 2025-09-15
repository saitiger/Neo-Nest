import { MilestoneCategory, Milestone } from '../types';

export const milestoneCategories: MilestoneCategory[] = [
  {
    id: 'motor-gross',
    name: 'Gross Motor',
    ageRangeStart: 0,
    ageRangeEnd: 104, // 2 years
    isPreterm: true,
    color: '#4CAF50'
  },
  {
    id: 'motor-fine',
    name: 'Fine Motor',
    ageRangeStart: 0,
    ageRangeEnd: 104,
    isPreterm: true,
    color: '#2196F3'
  },
  {
    id: 'communication',
    name: 'Communication',
    ageRangeStart: 0,
    ageRangeEnd: 104,
    isPreterm: true,
    color: '#FF9800'
  },
  {
    id: 'cognitive',
    name: 'Cognitive',
    ageRangeStart: 0,
    ageRangeEnd: 104,
    isPreterm: true,
    color: '#9C27B0'
  },
  {
    id: 'social-emotional',
    name: 'Social-Emotional',
    ageRangeStart: 0,
    ageRangeEnd: 104,
    isPreterm: true,
    color: '#F44336'
  }
];

export const sampleMilestones: Omit<Milestone, 'id' | 'babyId'>[] = [
  // 0-4 weeks corrected age
  {
    category: milestoneCategories[0], // Gross Motor
    description: 'Lifts head briefly when on tummy',
    status: 'not_started',
    correctedAgeAtAchievement: 2
  },
  {
    category: milestoneCategories[1], // Fine Motor
    description: 'Grasps finger when placed in palm',
    status: 'not_started',
    correctedAgeAtAchievement: 1
  },
  {
    category: milestoneCategories[2], // Communication
    description: 'Makes eye contact during feeding',
    status: 'not_started',
    correctedAgeAtAchievement: 3
  },
  
  // 4-8 weeks corrected age
  {
    category: milestoneCategories[0], // Gross Motor
    description: 'Holds head up for short periods during tummy time',
    status: 'not_started',
    correctedAgeAtAchievement: 6
  },
  {
    category: milestoneCategories[2], // Communication
    description: 'Begins to smile in response to faces',
    status: 'not_started',
    correctedAgeAtAchievement: 6
  },
  {
    category: milestoneCategories[4], // Social-Emotional
    description: 'Shows interest in faces and voices',
    status: 'not_started',
    correctedAgeAtAchievement: 7
  },
  
  // 8-12 weeks corrected age
  {
    category: milestoneCategories[0], // Gross Motor
    description: 'Holds head steady when upright',
    status: 'not_started',
    correctedAgeAtAchievement: 10
  },
  {
    category: milestoneCategories[1], // Fine Motor
    description: 'Opens and closes hands',
    status: 'not_started',
    correctedAgeAtAchievement: 9
  },
  {
    category: milestoneCategories[2], // Communication
    description: 'Makes cooing sounds',
    status: 'not_started',
    correctedAgeAtAchievement: 11
  },
  
  // 12-16 weeks corrected age
  {
    category: milestoneCategories[0], // Gross Motor
    description: 'Pushes up on forearms during tummy time',
    status: 'not_started',
    correctedAgeAtAchievement: 14
  },
  {
    category: milestoneCategories[1], // Fine Motor
    description: 'Brings hands to mouth',
    status: 'not_started',
    correctedAgeAtAchievement: 13
  },
  {
    category: milestoneCategories[2], // Communication
    description: 'Laughs and squeals',
    status: 'not_started',
    correctedAgeAtAchievement: 15
  },
  {
    category: milestoneCategories[4], // Social-Emotional
    description: 'Enjoys social play and may cry when it stops',
    status: 'not_started',
    correctedAgeAtAchievement: 16
  }
];