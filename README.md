# Neo-Nest

A mobile-first app for parents of preterm babies from NICU discharge through the toddler stage, providing doctor-backed guidance, corrected age tracking, and community support.

## Project Status

**Phase**: Hybrid Mobile Development - Authentication Complete ✅  
**Completed**: User research validation, React Native setup, corrected age utilities, milestone tracking, authentication system  
**Current**: Baby profile creation and corrected age integration  
**Next**: Milestone logging functionality and data persistence

### Development Progress
- ✅ **User Research**: Web prototype validation completed
- ✅ **React Native Setup**: TypeScript configuration and navigation structure
- ✅ **Core Utilities**: Corrected age calculation engine with comprehensive tests
- ✅ **Milestone System**: Preterm-specific milestone data and tracking screens
- ✅ **Cross-Platform UI**: Responsive design for iOS and Android
- ✅ **Authentication System**: Complete login, registration, and password recovery flow
- ✅ **User Management**: Secure data storage, JWT tokens, and session management
- 🚧 **Baby Profile Creation**: User onboarding and profile setup
- 🚧 **Data Persistence**: AsyncStorage integration for offline functionality

See [Implementation Plan](.kiro/specs/neo-nest-mvp/tasks.md) for detailed development roadmap.

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

- **Product Requirements**: [Helper-Elements/PRD-v1.md](Helper-Elements/PRD-v1.md)
- **Formal Requirements**: [.kiro/specs/neo-nest-mvp/requirements.md](.kiro/specs/neo-nest-mvp/requirements.md) - Detailed user stories and acceptance criteria
- **Mobile Development Plan**: [MOBILE-DEVELOPMENT-PLAN.md](MOBILE-DEVELOPMENT-PLAN.md) - Mobile app architecture and implementation strategy (hybrid approach)
- **Current Research Phase**: [MVP/README.md](MVP/README.md) - Web prototype for user validation
- **Development Guide**: [DEVELOPMENT-GUIDE.md](DEVELOPMENT-GUIDE.md) - Current web prototype workflow and debugging
- **Architecture Changes**: [ARCHITECTURE-CHANGE-LOG.md](ARCHITECTURE-CHANGE-LOG.md) - Record of major architectural decisions
- **Troubleshooting**: [bug-fixes.md](bug-fixes.md)

## Contributing

This project follows a documentation-first approach with comprehensive planning in `Helper-Elements/` and iterative development tracking in `MVP/`.
