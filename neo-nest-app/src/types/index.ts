export interface BabyProfile {
  id: string;
  name?: string;
  birthDate: Date;
  dueDate: Date;
  correctedAge: number;
  gender?: 'male' | 'female' | 'other';
  birthWeight?: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  babyId: string;
  category: MilestoneCategory;
  description: string;
  achievedDate?: Date;
  status: 'not_started' | 'in_progress' | 'achieved' | 'delayed';
  correctedAgeAtAchievement?: number;
  notes?: string;
}

export interface MilestoneCategory {
  id: string;
  name: string;
  ageRangeStart: number; // weeks
  ageRangeEnd: number;
  isPreterm: boolean;
  color: string;
}

export interface UserProfile {
  id: string;
  email: string;
  parentName: string;
  babies: BabyProfile[];
  createdAt: Date;
  updatedAt: Date;
}