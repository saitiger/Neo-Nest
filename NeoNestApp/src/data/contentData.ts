// Content library data structure and mock data for the Neo-Nest app

export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'infographic';
  content: string;
  summary: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // for videos, in minutes
  ageRanges: number[]; // corrected age ranges in weeks
  categories: string[];
  tags: string[];
  clinicalReview: ClinicalReview;
  publishedAt: Date;
  updatedAt: Date;
  readTime?: number; // estimated read time in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isBookmarked?: boolean;
  viewCount?: number;
}

export interface ClinicalReview {
  reviewerId: string;
  reviewerName: string;
  reviewerCredentials: string;
  reviewerTitle: string;
  reviewDate: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ageRanges?: number[];
}

// Content categories
export const contentCategories: ContentCategory[] = [
  {
    id: 'feeding',
    name: 'Feeding & Nutrition',
    description: 'Breastfeeding, bottle feeding, and introducing solids for preterm babies',
    icon: 'restaurant',
    color: '#E74C3C',
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Physical, cognitive, and social development milestones',
    icon: 'child-care',
    color: '#3498DB',
  },
  {
    id: 'sleep',
    name: 'Sleep & Routines',
    description: 'Sleep patterns, safe sleep practices, and establishing routines',
    icon: 'bedtime',
    color: '#9B59B6',
  },
  {
    id: 'health',
    name: 'Health & Medical',
    description: 'Medical care, appointments, and health monitoring',
    icon: 'local-hospital',
    color: '#2ECC71',
  },
  {
    id: 'play',
    name: 'Play & Activities',
    description: 'Age-appropriate activities and developmental play',
    icon: 'toys',
    color: '#F39C12',
  },
  {
    id: 'emotional',
    name: 'Emotional Support',
    description: 'Coping strategies and emotional well-being for parents',
    icon: 'favorite',
    color: '#E91E63',
  },
];

// Mock content data
export const mockContentData: ContentItem[] = [
  {
    id: 'content-1',
    title: 'Understanding Corrected Age: A Parent\'s Guide',
    type: 'article',
    content: `# Understanding Corrected Age: A Parent's Guide

Corrected age is one of the most important concepts for parents of preterm babies to understand. It helps you track your baby's development more accurately and reduces unnecessary worry about delayed milestones.

## What is Corrected Age?

Corrected age (also called adjusted age) is your baby's age based on their original due date, not their birth date. For example, if your baby was born 8 weeks early and is now 12 weeks old, their corrected age would be 4 weeks.

## Why is Corrected Age Important?

Preterm babies need extra time to catch up to their full-term peers. Using corrected age helps:
- Set realistic expectations for development
- Reduce anxiety about "delayed" milestones
- Communicate effectively with healthcare providers
- Make appropriate decisions about feeding, sleep, and activities

## How to Calculate Corrected Age

The formula is simple:
**Corrected Age = Chronological Age - Weeks Born Early**

Most healthcare providers use corrected age until your child is 2-3 years old, depending on how early they were born.

## When to Use Corrected Age

Use corrected age for:
- Developmental milestones
- Sleep expectations
- Feeding schedules
- Activity planning
- Medical appointments

Remember, every baby develops at their own pace, even when using corrected age. Trust your instincts and work closely with your healthcare team.`,
    summary: 'Learn how to calculate and use corrected age to track your preterm baby\'s development accurately.',
    ageRanges: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104],
    categories: ['development', 'health'],
    tags: ['corrected age', 'preterm', 'development', 'milestones'],
    clinicalReview: {
      reviewerId: 'dr-smith-001',
      reviewerName: 'Dr. Sarah Smith',
      reviewerCredentials: 'MD, Neonatologist',
      reviewerTitle: 'Attending Neonatologist, Children\'s Hospital',
      reviewDate: new Date('2024-01-15'),
      approvalStatus: 'approved',
    },
    publishedAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    readTime: 5,
    difficulty: 'beginner',
    viewCount: 1250,
  },
  {
    id: 'content-2',
    title: 'Feeding Your Preterm Baby: From NICU to Home',
    type: 'video',
    content: `# Feeding Your Preterm Baby: From NICU to Home

This comprehensive video guide covers the transition from NICU feeding to home feeding routines for preterm babies.

## Topics Covered:
- Breastfeeding challenges and solutions
- Bottle feeding techniques
- Pumping and milk storage
- Feeding schedules based on corrected age
- Signs of feeding difficulties
- When to seek help

## Key Takeaways:
- Preterm babies may take longer to establish feeding patterns
- Patience and consistency are key
- Work closely with your pediatrician and lactation consultant
- Every baby's feeding journey is unique`,
    summary: 'Comprehensive video guide on feeding preterm babies from NICU discharge through the first months at home.',
    mediaUrl: 'https://example.com/videos/preterm-feeding-guide.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/feeding-guide.jpg',
    duration: 18,
    ageRanges: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
    categories: ['feeding', 'health'],
    tags: ['feeding', 'breastfeeding', 'bottle feeding', 'NICU', 'preterm'],
    clinicalReview: {
      reviewerId: 'lc-johnson-002',
      reviewerName: 'Lisa Johnson',
      reviewerCredentials: 'RN, IBCLC',
      reviewerTitle: 'Lactation Consultant, NICU',
      reviewDate: new Date('2024-01-10'),
      approvalStatus: 'approved',
    },
    publishedAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    difficulty: 'intermediate',
    viewCount: 890,
  },
  {
    id: 'content-3',
    title: 'Safe Sleep for Preterm Babies',
    type: 'article',
    content: `# Safe Sleep for Preterm Babies

Creating a safe sleep environment is crucial for all babies, but preterm babies may have additional considerations.

## Safe Sleep Basics

### Always place your baby:
- On their back to sleep
- On a firm sleep surface
- In a crib or bassinet free of soft bedding
- In your room (but not in your bed) for at least the first 6 months

## Special Considerations for Preterm Babies

### Temperature Regulation
Preterm babies may have difficulty regulating their body temperature. Consider:
- Room temperature between 68-70°F
- Appropriate sleepwear for the temperature
- Avoiding overheating

### Breathing Monitoring
Some preterm babies may come home with:
- Apnea monitors
- Pulse oximeters
- Special positioning devices (as recommended by your medical team)

### Sleep Patterns
Preterm babies may:
- Sleep more than full-term babies initially
- Have irregular sleep-wake cycles
- Take longer to develop day-night patterns

## When to Call Your Doctor

Contact your healthcare provider if you notice:
- Changes in breathing patterns
- Unusual color changes
- Difficulty waking for feeds
- Any concerns about your baby's sleep

Remember, safe sleep practices save lives. When in doubt, consult your healthcare team.`,
    summary: 'Essential safe sleep guidelines specifically tailored for preterm babies and their unique needs.',
    ageRanges: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52],
    categories: ['sleep', 'health'],
    tags: ['safe sleep', 'SIDS prevention', 'preterm', 'sleep safety'],
    clinicalReview: {
      reviewerId: 'dr-martinez-003',
      reviewerName: 'Dr. Carlos Martinez',
      reviewerCredentials: 'MD, Pediatrician',
      reviewerTitle: 'Pediatrician, Preterm Follow-up Clinic',
      reviewDate: new Date('2024-01-12'),
      approvalStatus: 'approved',
    },
    publishedAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    readTime: 7,
    difficulty: 'beginner',
    viewCount: 2100,
  },
  {
    id: 'content-4',
    title: 'Tummy Time for Preterm Babies',
    type: 'video',
    content: `# Tummy Time for Preterm Babies

Tummy time is important for all babies, but preterm babies may need a modified approach based on their corrected age and individual development.

## Benefits of Tummy Time:
- Strengthens neck and shoulder muscles
- Prevents flat spots on the head
- Promotes motor development
- Encourages visual development

## Getting Started:
- Begin when your baby is alert and content
- Start with short sessions (1-2 minutes)
- Gradually increase duration as tolerated
- Always supervise tummy time

## Modifications for Preterm Babies:
- Use corrected age to determine readiness
- May need extra support initially
- Watch for signs of fatigue
- Consult with physical therapist if needed`,
    summary: 'Learn how to safely introduce and progress tummy time activities for your preterm baby.',
    mediaUrl: 'https://example.com/videos/tummy-time-preterm.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/tummy-time.jpg',
    duration: 12,
    ageRanges: [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
    categories: ['development', 'play'],
    tags: ['tummy time', 'motor development', 'physical therapy', 'preterm'],
    clinicalReview: {
      reviewerId: 'pt-wilson-004',
      reviewerName: 'Amanda Wilson',
      reviewerCredentials: 'PT, DPT',
      reviewerTitle: 'Pediatric Physical Therapist',
      reviewDate: new Date('2024-01-08'),
      approvalStatus: 'approved',
    },
    publishedAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    difficulty: 'beginner',
    viewCount: 1450,
  },
  {
    id: 'content-5',
    title: 'Managing Parental Stress After NICU Discharge',
    type: 'article',
    content: `# Managing Parental Stress After NICU Discharge

Bringing your preterm baby home from the NICU is a major milestone, but it can also bring new stresses and anxieties. You're not alone in feeling overwhelmed.

## Common Feelings After NICU Discharge

It's normal to experience:
- Anxiety about caring for your baby at home
- Fear about medical emergencies
- Feeling unprepared or incompetent
- Grief about the NICU experience
- Isolation from friends and family

## Coping Strategies

### Build Your Support Network
- Connect with other NICU parents
- Join support groups (online or in-person)
- Accept help from family and friends
- Maintain relationships with your NICU team

### Practice Self-Care
- Get rest when possible
- Eat nutritious meals
- Take breaks when you can
- Engage in activities you enjoy

### Manage Anxiety
- Learn relaxation techniques
- Practice mindfulness or meditation
- Keep a journal
- Set realistic expectations

### Stay Organized
- Keep medical information accessible
- Maintain feeding and sleep logs
- Prepare emergency contact lists
- Create routines that work for your family

## When to Seek Professional Help

Consider talking to a mental health professional if you experience:
- Persistent sadness or hopelessness
- Severe anxiety that interferes with daily life
- Difficulty bonding with your baby
- Thoughts of harming yourself or your baby
- Inability to care for yourself or your baby

## Resources for Support

- NICU parent support groups
- Mental health counselors specializing in NICU families
- Online communities and forums
- Your pediatrician or family doctor
- Social workers at your hospital

Remember, seeking help is a sign of strength, not weakness. Taking care of yourself is essential for taking care of your baby.`,
    summary: 'Practical strategies for managing stress, anxiety, and emotional challenges after bringing your preterm baby home.',
    ageRanges: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104],
    categories: ['emotional'],
    tags: ['parental stress', 'mental health', 'NICU discharge', 'anxiety', 'support'],
    clinicalReview: {
      reviewerId: 'sw-brown-005',
      reviewerName: 'Jennifer Brown',
      reviewerCredentials: 'LCSW, MSW',
      reviewerTitle: 'Clinical Social Worker, NICU Family Support',
      reviewDate: new Date('2024-01-14'),
      approvalStatus: 'approved',
    },
    publishedAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    readTime: 8,
    difficulty: 'intermediate',
    viewCount: 980,
  },
  {
    id: 'content-6',
    title: 'First Pediatric Appointments: What to Expect',
    type: 'infographic',
    content: `# First Pediatric Appointments: What to Expect

Your first pediatric appointments after NICU discharge are important for monitoring your baby's progress and addressing any concerns.

## Before the Appointment

### Prepare Information:
- NICU discharge summary
- Current medications and dosages
- Feeding schedule and amounts
- Sleep patterns
- Any concerns or questions

### Bring Items:
- Insurance cards
- Emergency contact information
- Diaper bag with supplies
- Comfort items for baby

## During the Appointment

### What to Expect:
- Weight, length, and head circumference measurements
- Physical examination
- Discussion of feeding and growth
- Review of developmental milestones (using corrected age)
- Immunization schedule review
- Discussion of any concerns

### Questions to Ask:
- Is my baby growing appropriately for their corrected age?
- Are we on track with developmental milestones?
- What should I watch for between appointments?
- When should I be concerned?
- What activities should we focus on?

## After the Appointment

### Follow-up Actions:
- Schedule next appointment
- Fill any new prescriptions
- Implement any recommended changes
- Contact office with questions that arise

## Red Flags to Report

Contact your pediatrician immediately if you notice:
- Difficulty breathing or changes in breathing patterns
- Poor feeding or refusal to eat
- Excessive sleepiness or difficulty waking
- Fever (temperature guidelines vary by age)
- Unusual fussiness or changes in behavior
- Any other concerns about your baby's health

Remember, your pediatrician is your partner in your baby's care. Don't hesitate to ask questions or voice concerns.`,
    summary: 'A comprehensive guide to preparing for and navigating your preterm baby\'s first pediatric appointments.',
    ageRanges: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
    categories: ['health'],
    tags: ['pediatric appointments', 'medical care', 'NICU follow-up', 'healthcare'],
    clinicalReview: {
      reviewerId: 'dr-patel-006',
      reviewerName: 'Dr. Priya Patel',
      reviewerCredentials: 'MD, Pediatrician',
      reviewerTitle: 'Pediatrician, Preterm Infant Clinic',
      reviewDate: new Date('2024-01-16'),
      approvalStatus: 'approved',
    },
    publishedAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    readTime: 6,
    difficulty: 'beginner',
    viewCount: 1680,
  },
];

// Search and filter functions
export const searchContent = (
  content: ContentItem[],
  query: string,
  filters: {
    categories?: string[];
    ageRange?: number;
    type?: string[];
    difficulty?: string[];
  } = {}
): ContentItem[] => {
  let filteredContent = [...content];

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredContent = filteredContent.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.summary.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      item.categories.some(category => category.toLowerCase().includes(searchTerm))
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filteredContent = filteredContent.filter(item =>
      item.categories.some(category => filters.categories!.includes(category))
    );
  }

  // Age range filter
  if (filters.ageRange !== undefined) {
    filteredContent = filteredContent.filter(item =>
      item.ageRanges.includes(filters.ageRange!)
    );
  }

  // Content type filter
  if (filters.type && filters.type.length > 0) {
    filteredContent = filteredContent.filter(item =>
      filters.type!.includes(item.type)
    );
  }

  // Difficulty filter
  if (filters.difficulty && filters.difficulty.length > 0) {
    filteredContent = filteredContent.filter(item =>
      filters.difficulty!.includes(item.difficulty)
    );
  }

  return filteredContent;
};

// Get content by category
export const getContentByCategory = (content: ContentItem[], categoryId: string): ContentItem[] => {
  return content.filter(item => item.categories.includes(categoryId));
};

// Get content by age range
export const getContentByAgeRange = (content: ContentItem[], ageInWeeks: number): ContentItem[] => {
  return content.filter(item => item.ageRanges.includes(ageInWeeks));
};

// Get bookmarked content
export const getBookmarkedContent = (content: ContentItem[]): ContentItem[] => {
  return content.filter(item => item.isBookmarked);
};