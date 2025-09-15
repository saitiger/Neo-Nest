# Neo-Nest

A mobile-first app for parents of preterm babies from NICU discharge through the toddler stage, providing doctor-backed guidance, corrected age tracking, and community support.

## Project Status

**Phase**: Phase 11 - Testing and Quality Assurance 🚧  
**Completed**: User research validation, React Native foundation, core utilities, authentication system, baby profile system, milestone tracking system, community forum system, onboarding flow, navigation and user experience enhancements  
**Current**: Comprehensive testing suite, cross-platform validation, security testing  
**Next**: Performance optimization, accessibility compliance, deployment preparation

### Development Progress
- ✅ **Phase 1**: User Research & Validation (2-4 weeks) - Complete
- ✅ **Phase 2**: React Native Foundation (1-2 weeks) - Complete  
- ✅ **Phase 3**: Core Utilities & Milestone System (1-2 weeks) - Complete
- ✅ **Phase 4**: Authentication System (2-3 weeks) - Complete
- ✅ **Phase 5**: Baby Profile System (1-2 weeks) - Complete
- ✅ **Phase 6**: Milestone Tracking System (1-2 weeks) - Complete
- ✅ **Phase 7**: Community Forum System (1-2 weeks) - Complete
- ✅ **Phase 8**: Onboarding Flow (1 week) - Complete
- ✅ **Phase 9**: Navigation and User Experience (1 week) - Complete
- 🚧 **Phase 11**: Testing and Quality Assurance - In Progress
- 📋 **Phase 10, 12**: Performance optimization, accessibility, deployment preparation

### Major Achievements
- ✅ **Production-Ready Authentication**: Complete login, registration, password recovery with secure token management
- ✅ **Cross-Platform Architecture**: React Native 0.81.4 with TypeScript, iOS/Android compatibility
- ✅ **Corrected Age Engine**: Comprehensive calculation utilities with 100% test coverage
- ✅ **Baby Profile System**: Complete profile creation, management, and corrected age integration
- ✅ **Milestone Tracking System**: Full categorization, logging, progress tracking, and export functionality
- ✅ **Community Forum System**: Complete moderated discussions with expert integration and category-based organization
- ✅ **Onboarding Flow**: Professional welcome, features, permissions, and completion screens
- ✅ **Navigation Architecture**: Comprehensive TypeScript navigation types and screen definitions
- ✅ **Interactive Web Preview**: Browser-based demo showcasing complete app functionality
- ✅ **Security Implementation**: Encrypted AsyncStorage, JWT tokens, form validation
- ✅ **Professional UI/UX**: WCAG 2.1 AA compliant design with consistent branding

See [Implementation Plan](.kiro/specs/neo-nest-mvp/tasks.md) for detailed development roadmap and [Development Achievements](ACHIEVEMENTS.md) for comprehensive progress tracking.

## Quick Start

### Interactive Web Preview (Instant Demo)
```bash
# Navigate to React Native project and open web preview
cd NeoNestApp
# Double-click web-preview.html or open in browser
open web-preview.html
```

The web preview provides an interactive demonstration of the complete Neo-Nest app including:
- Baby profile management with corrected age calculations
- Milestone tracking with progress indicators and categories
- Community forum with expert posts and moderated discussions
- Complete navigation between all main app screens

### React Native Mobile App
```bash
# Navigate to React Native project
cd NeoNestApp
npm install

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android
```

### MVP Home Page (User Research - Completed)
```bash
# Navigate to MVP directory and open in browser
cd MVP
# Double-click index.html or serve locally
```

**Important**: The JavaScript requires a browser environment. Do not run `script.js` directly with Node.js.

## Project Structure

```
Neo-Nest/
├── NeoNestApp/             # React Native mobile app (primary development)
│   ├── src/
│   │   ├── screens/        # Complete app screens (Home, Milestones, Community, Profile)
│   │   ├── contexts/       # React Context providers for state management
│   │   ├── utils/          # Corrected age calculations and services
│   │   ├── navigation/     # App navigation configuration
│   │   └── data/           # Milestone and community data definitions
│   ├── __tests__/          # Comprehensive test suite with 100% coverage
│   ├── web-preview.html    # Interactive web demo for stakeholders
│   └── App.tsx             # Main app component
├── Helper-Elements/        # Project planning and documentation
│   ├── PRD-v1.md          # Product Requirements Document
│   └── README.md          # Planning materials overview
├── MVP/                   # User research phase (completed)
│   ├── index.html         # User research landing page
│   ├── script.js          # Interactive feedback collection
│   ├── styles.css         # Mobile-first responsive design
│   └── README.md          # MVP documentation
├── .kiro/specs/           # Formal specifications
│   └── neo-nest-mvp/      # MVP requirements and design
└── .kiro/steering/        # AI assistant configuration
```

## Core Features (Planned)

- **Corrected Age Tracking**: Progress tracker understanding preterm development
- **Doctor-Backed Content**: Clinician-reviewed articles and milestones  
- **Moderated Community**: Safe peer support with expert oversight
- **Activity Library**: Age-appropriate play suggestions
- **Provider Directory**: Specialized healthcare provider listings

## Target Users

- New NICU-discharge parents (25-40, first-time or multiples)
- Parents of preterm toddlers (28-42, returning to work)
- Healthcare experts (pediatricians, neonatologists, therapists)

## Development Approach

- **Platform**: Hybrid Mobile (React Native/Flutter) for cross-platform MVP
- **Current Phase**: User research validation via web prototype
- **Next Phase**: Hybrid mobile app development with validated features
- **Methodology**: Lean, iterative with user research validation
- **Timeline**: 4-8 weeks MVP, followed by V1 and V2 phases

## Documentation

- **Development Achievements**: [ACHIEVEMENTS.md](ACHIEVEMENTS.md) - Comprehensive progress tracking and technical accomplishments
- **Product Requirements**: [Helper-Elements/PRD-v1.md](Helper-Elements/PRD-v1.md)
- **Formal Requirements**: [.kiro/specs/neo-nest-mvp/requirements.md](.kiro/specs/neo-nest-mvp/requirements.md) - Detailed user stories and acceptance criteria
- **Mobile Development Plan**: [MOBILE-DEVELOPMENT-PLAN.md](MOBILE-DEVELOPMENT-PLAN.md) - Mobile app architecture and implementation strategy (hybrid approach)
- **User Research Phase**: [MVP/README.md](MVP/README.md) - Web prototype for user validation (completed)
- **Development Guide**: [DEVELOPMENT-GUIDE.md](DEVELOPMENT-GUIDE.md) - Web prototype workflow and debugging
- **Architecture Changes**: [ARCHITECTURE-CHANGE-LOG.md](ARCHITECTURE-CHANGE-LOG.md) - Record of major architectural decisions
- **Troubleshooting**: [bug-fixes.md](bug-fixes.md)

## Contributing

This project follows a documentation-first approach with comprehensive planning in `Helper-Elements/` and iterative development tracking in `MVP/`.
