# Neo-Nest

A mobile-first app for parents of preterm babies from NICU discharge through the toddler stage, providing doctor-backed guidance, corrected age tracking, and community support.

## Project Status

**Phase**: Phase 5 - Baby Profile System Development 🚧  
**Completed**: User research validation, React Native foundation, core utilities, milestone system, complete authentication system  
**Current**: Baby profile creation and corrected age integration  
**Next**: Milestone logging functionality and data persistence

### Development Progress
- ✅ **Phase 1**: User Research & Validation (2-4 weeks) - Complete
- ✅ **Phase 2**: React Native Foundation (1-2 weeks) - Complete  
- ✅ **Phase 3**: Core Utilities & Milestone System (1-2 weeks) - Complete
- ✅ **Phase 4**: Authentication System (2-3 weeks) - Complete
- 🚧 **Phase 5**: Baby Profile System - In Progress
- 📋 **Phase 6-12**: Content library, community features, provider directory, premium features

### Major Achievements
- ✅ **Production-Ready Authentication**: Complete login, registration, password recovery with secure token management
- ✅ **Cross-Platform Architecture**: React Native 0.81.4 with TypeScript, iOS/Android compatibility
- ✅ **Corrected Age Engine**: Comprehensive calculation utilities with 100% test coverage
- ✅ **Milestone Foundation**: Preterm-specific milestone data and interactive tracking screens
- ✅ **Security Implementation**: Encrypted AsyncStorage, JWT tokens, form validation
- ✅ **Professional UI/UX**: WCAG 2.1 AA compliant design with consistent branding

See [Implementation Plan](.kiro/specs/neo-nest-mvp/tasks.md) for detailed development roadmap and [Development Achievements](ACHIEVEMENTS.md) for comprehensive progress tracking.

## Quick Start

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
│   │   ├── screens/        # Home and Milestones screens
│   │   ├── utils/          # Corrected age calculations
│   │   └── data/           # Milestone definitions
│   ├── __tests__/          # Comprehensive test suite
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
