# Neo-Nest

A mobile-first app for parents of preterm babies from NICU discharge through the toddler stage, providing doctor-backed guidance, corrected age tracking, and community support.

## Project Status

Currently in **User Research Phase** - validating concept with web prototype before hybrid mobile app development. Collecting feedback from preterm parents to inform cross-platform mobile app features.

## Quick Start

### MVP Home Page (User Research)
```bash
# Navigate to MVP directory and open in browser
cd MVP
# Double-click index.html or serve locally
```

**Important**: The JavaScript requires a browser environment. Do not run `script.js` directly with Node.js.

## Project Structure

```
Neo-Nest/
├── Helper-Elements/         # Project planning and documentation
│   ├── PRD-v1.md           # Product Requirements Document
│   └── README.md           # Planning materials overview
├── MVP/                    # Current development phase
│   ├── index.html          # User research landing page
│   ├── script.js           # Interactive feedback collection
│   ├── styles.css          # Mobile-first responsive design
│   ├── README.md           # MVP documentation
│   └── Getting Started.md  # Development notes
├── bug-fixes.md           # Troubleshooting documentation
└── .kiro/                 # AI assistant configuration
    └── steering/          # Development guidance
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
