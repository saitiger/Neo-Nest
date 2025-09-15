// Navigation type definitions for the entire app
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Milestones: undefined;
  Community: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  BabyProfile: {
    isEditing?: boolean;
    profileId?: string;
  };
  MilestoneDetail: {
    milestone: any;
    currentStatus: string;
  };
  PostDetail: {
    postId: string;
  };
  CreatePost: {
    categoryId?: string;
  };
  CommunityGroups: undefined;
  GroupDetail: {
    groupId: string;
  };
  Settings: undefined;
  Notifications: undefined;
  Help: undefined;
  About: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Features: undefined;
  Permissions: undefined;
  Complete: undefined;
};

// Screen props types
export interface ScreenProps<T extends keyof any> {
  navigation: any;
  route: {
    params: T;
  };
}