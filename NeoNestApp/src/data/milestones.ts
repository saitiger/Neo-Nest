/**
 * Milestone data for preterm babies using corrected age
 * Based on clinical guidelines for preterm development
 */

export interface Milestone {
  id: string;
  title: string;
  category: 'motor' | 'cognitive' | 'social' | 'language';
  correctedAgeRangeWeeks: [number, number]; // [min weeks, max weeks]
  description: string;
  clinicalNotes?: string;
  watchForDelayWeeks?: number; // When to be concerned if not achieved
  isPreterm?: boolean; // Specific to preterm babies
}

export const milestoneCategories = {
  motor: 'Motor Skills',
  cognitive: 'Cognitive Development',
  social: 'Social & Emotional',
  language: 'Language & Communication',
};

export const milestones: Milestone[] = [
  // 0-3 months corrected age
  {
    id: 'social-smile',
    title: 'Social Smile',
    category: 'social',
    correctedAgeRangeWeeks: [6, 8],
    description: 'Baby smiles in response to your voice or face, not just gas',
    clinicalNotes: 'One of the first meaningful social interactions',
    watchForDelayWeeks: 12,
  },
  {
    id: 'head-control-prone',
    title: 'Head Control (Prone)',
    category: 'motor',
    correctedAgeRangeWeeks: [8, 12],
    description: 'Lifts head briefly when lying on tummy',
    clinicalNotes: 'Important for neck strength development',
    watchForDelayWeeks: 16,
  },
  {
    id: 'visual-tracking',
    title: 'Visual Tracking',
    category: 'cognitive',
    correctedAgeRangeWeeks: [8, 12],
    description: 'Follows objects with eyes from side to side',
    clinicalNotes: 'Shows developing visual processing',
    watchForDelayWeeks: 16,
  },
  
  // 3-6 months corrected age
  {
    id: 'head-control-sitting',
    title: 'Steady Head Control',
    category: 'motor',
    correctedAgeRangeWeeks: [12, 16],
    description: 'Holds head steady when supported in sitting position',
    clinicalNotes: 'Prerequisite for sitting independently',
    watchForDelayWeeks: 20,
  },
  {
    id: 'laughing',
    title: 'Laughing',
    category: 'social',
    correctedAgeRangeWeeks: [12, 20],
    description: 'Laughs out loud in response to play',
    clinicalNotes: 'Shows emotional development and social engagement',
    watchForDelayWeeks: 24,
  },
  {
    id: 'reaching-grasping',
    title: 'Reaching and Grasping',
    category: 'motor',
    correctedAgeRangeWeeks: [16, 20],
    description: 'Reaches for and grasps toys with intention',
    clinicalNotes: 'Shows hand-eye coordination development',
    watchForDelayWeeks: 24,
  },
  
  // 6-9 months corrected age
  {
    id: 'rolling-over',
    title: 'Rolling Over',
    category: 'motor',
    correctedAgeRangeWeeks: [20, 28],
    description: 'Rolls from tummy to back and back to tummy',
    clinicalNotes: 'Important mobility milestone',
    watchForDelayWeeks: 32,
    isPreterm: true,
  },
  {
    id: 'sitting-support',
    title: 'Sitting with Support',
    category: 'motor',
    correctedAgeRangeWeeks: [24, 28],
    description: 'Sits with minimal support, may use hands for balance',
    clinicalNotes: 'Precursor to independent sitting',
    watchForDelayWeeks: 36,
  },
  {
    id: 'babbling',
    title: 'Babbling',
    category: 'language',
    correctedAgeRangeWeeks: [20, 28],
    description: 'Makes repetitive consonant-vowel sounds (ba-ba, da-da)',
    clinicalNotes: 'Foundation for speech development',
    watchForDelayWeeks: 32,
  },
  
  // 9-12 months corrected age
  {
    id: 'sitting-independent',
    title: 'Independent Sitting',
    category: 'motor',
    correctedAgeRangeWeeks: [28, 36],
    description: 'Sits without support for extended periods',
    clinicalNotes: 'Major postural milestone',
    watchForDelayWeeks: 44,
  },
  {
    id: 'crawling',
    title: 'Crawling',
    category: 'motor',
    correctedAgeRangeWeeks: [32, 44],
    description: 'Moves forward on hands and knees',
    clinicalNotes: 'Some babies skip crawling and go straight to walking',
    watchForDelayWeeks: 52,
    isPreterm: true,
  },
  {
    id: 'object-permanence',
    title: 'Object Permanence',
    category: 'cognitive',
    correctedAgeRangeWeeks: [32, 40],
    description: 'Looks for toys when they disappear (peek-a-boo)',
    clinicalNotes: 'Shows understanding that objects exist when not visible',
    watchForDelayWeeks: 48,
  },
  
  // 12-18 months corrected age
  {
    id: 'pulling-to-stand',
    title: 'Pulling to Stand',
    category: 'motor',
    correctedAgeRangeWeeks: [40, 48],
    description: 'Pulls self up to standing position using furniture',
    clinicalNotes: 'Precursor to walking',
    watchForDelayWeeks: 56,
  },
  {
    id: 'first-words',
    title: 'First Words',
    category: 'language',
    correctedAgeRangeWeeks: [44, 56],
    description: 'Says first meaningful words besides "mama" and "dada"',
    clinicalNotes: 'May be delayed in preterm babies',
    watchForDelayWeeks: 68,
    isPreterm: true,
  },
  {
    id: 'walking-independent',
    title: 'Independent Walking',
    category: 'motor',
    correctedAgeRangeWeeks: [48, 68],
    description: 'Walks independently without support',
    clinicalNotes: 'Often delayed in preterm babies - use corrected age',
    watchForDelayWeeks: 80,
    isPreterm: true,
  },
];

/**
 * Get milestones appropriate for a specific corrected age
 * @param correctedAgeWeeks - Baby's corrected age in weeks
 * @param includeUpcoming - Include milestones coming up in next 8 weeks
 * @returns Array of relevant milestones
 */
export const getMilestonesForAge = (
  correctedAgeWeeks: number,
  includeUpcoming: boolean = true
): Milestone[] => {
  return milestones.filter(milestone => {
    const [minWeeks, maxWeeks] = milestone.correctedAgeRangeWeeks;
    const upcomingThreshold = includeUpcoming ? 8 : 0;
    
    return correctedAgeWeeks >= minWeeks - upcomingThreshold && 
           correctedAgeWeeks <= maxWeeks + 4; // Include 4 weeks past for late achievers
  });
};

/**
 * Get milestones by category
 * @param category - Milestone category
 * @returns Array of milestones in that category
 */
export const getMilestonesByCategory = (
  category: keyof typeof milestoneCategories
): Milestone[] => {
  return milestones.filter(milestone => milestone.category === category);
};

/**
 * Check if a milestone should be flagged for delay
 * @param milestone - The milestone to check
 * @param correctedAgeWeeks - Baby's current corrected age in weeks
 * @returns boolean indicating if milestone is significantly delayed
 */
export const isMilestoneDelayed = (
  milestone: Milestone,
  correctedAgeWeeks: number
): boolean => {
  if (!milestone.watchForDelayWeeks) return false;
  return correctedAgeWeeks > milestone.watchForDelayWeeks;
};