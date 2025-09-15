import React, {createContext, useContext, ReactNode} from 'react';

interface HelpContent {
  title: string;
  description: string;
  tips?: string[];
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface HelpContextType {
  getHelpContent: (screenName: string) => HelpContent | null;
  showHelp: (screenName: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

interface HelpProviderProps {
  children: ReactNode;
}

const helpContentMap: Record<string, HelpContent> = {
  home: {
    title: 'Home Dashboard',
    description: 'Your personalized dashboard shows your baby\'s current corrected age, recent milestone achievements, and quick access to important features.',
    tips: [
      'Check your baby\'s corrected age display at the top',
      'Recent milestones show your baby\'s latest achievements',
      'Use quick actions to log new milestones or ask questions',
      'The dashboard updates automatically as your baby grows',
    ],
  },
  milestones: {
    title: 'Milestone Tracker',
    description: 'Track your preterm baby\'s developmental milestones using corrected age ranges. Milestones are organized by categories and age ranges specific to preterm development.',
    tips: [
      'Milestones are based on corrected age, not chronological age',
      'Green checkmarks indicate achieved milestones',
      'Yellow indicators suggest milestones to watch',
      'Red indicators may need healthcare provider discussion',
      'Tap any milestone to log achievement or add notes',
    ],
  },
  community: {
    title: 'Community Forum',
    description: 'Connect with other NICU parents and healthcare professionals. All posts are moderated to ensure helpful, supportive discussions.',
    tips: [
      'Posts are organized by categories for easy browsing',
      'Expert responses are marked with verified badges',
      'Use the search function to find specific topics',
      'Be respectful and supportive in all interactions',
      'Report inappropriate content using the flag button',
    ],
  },
  profile: {
    title: 'Profile & Settings',
    description: 'Manage your baby\'s profile information, notification preferences, and access help resources.',
    tips: [
      'Keep your baby\'s birth and due dates accurate for correct age calculations',
      'Enable notifications for milestone reminders',
      'Review privacy settings regularly',
      'Access help documentation and support contacts',
    ],
  },
  'baby-profile': {
    title: 'Baby Profile Setup',
    description: 'Your baby\'s profile information is used to calculate corrected age and personalize milestone tracking.',
    tips: [
      'Birth date and due date are required for corrected age calculation',
      'Optional information helps personalize the experience',
      'You can update this information anytime',
      'All data is stored securely on your device',
    ],
  },
  'milestone-detail': {
    title: 'Milestone Details',
    description: 'View detailed information about specific milestones, including typical age ranges and development tips.',
    tips: [
      'Age ranges are based on corrected age for preterm babies',
      'Development tips provide guidance for encouraging skills',
      'Log achievements with photos and notes',
      'Share progress with healthcare providers',
    ],
  },
  'corrected-age': {
    title: 'Understanding Corrected Age',
    description: 'Corrected age accounts for premature birth by subtracting the weeks born early from your baby\'s chronological age.',
    tips: [
      'Used until your baby is 2 years old (corrected age)',
      'Helps track development more accurately',
      'Important for milestone expectations',
      'Share with all healthcare providers',
      'Calculated as: (Current age) - (Weeks premature)',
    ],
  },
};

export const HelpProvider: React.FC<HelpProviderProps> = ({children}) => {
  const getHelpContent = (screenName: string): HelpContent | null => {
    return helpContentMap[screenName] || null;
  };

  const showHelp = (screenName: string) => {
    // This could trigger a modal or navigation to help screen
    console.log(`Showing help for: ${screenName}`);
  };

  const value: HelpContextType = {
    getHelpContent,
    showHelp,
  };

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = (): HelpContextType => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};