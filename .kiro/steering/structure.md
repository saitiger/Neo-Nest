# Project Structure

## Current Organization

```
Neo-Nest/
├── .kiro/                    # Kiro AI assistant configuration
│   ├── specs/               # Formal specifications
│   │   └── neo-nest-mvp/   # MVP specification documents
│   │       └── requirements.md # Detailed user stories and acceptance criteria
│   └── steering/            # AI guidance rules
├── Helper-Elements/         # Project planning and documentation
│   ├── PRD-v1.md           # Product Requirements Document
│   └── README.md           # Helper elements overview
├── MVP/                     # User research phase (web prototype)
│   ├── index.html          # User research landing page
│   ├── script.js           # Interactive functionality
│   ├── styles.css          # Responsive styling
│   ├── README.md           # MVP documentation
│   └── Getting Started.md  # Development notes
├── MOBILE-DEVELOPMENT-PLAN.md # Hybrid mobile app development strategy
├── DEVELOPMENT-GUIDE.md     # Web prototype development workflow
├── ARCHITECTURE-CHANGE-LOG.md # Record of major architectural decisions
├── bug-fixes.md            # Troubleshooting documentation
└── README.md               # Project overview
```

## Documentation Standards
- **PRD**: Comprehensive product requirements in Helper-Elements/
- **Formal Requirements**: Detailed specifications with user stories in .kiro/specs/neo-nest-mvp/
- **Planning**: All planning documents centralized in Helper-Elements/
- **Progress Tracking**: Development journey documented with daily updates

## File Naming Conventions
- Use kebab-case for markdown files where appropriate
- Descriptive names that indicate content purpose
- Version numbers for iterative documents (e.g., PRD-v1.md)

## Content Organization
- **Helper-Elements/**: Contains all pre-development planning materials
- **MVP/**: User research phase with web prototype for validation
- **MOBILE-DEVELOPMENT-PLAN.md**: Hybrid mobile app architecture and development strategy
- **DEVELOPMENT-GUIDE.md**: Web prototype technical documentation and debugging
- **Root**: High-level project overview and navigation

## Development Notes
- Project follows a lean, iterative approach
- Documentation-first methodology with comprehensive PRD
- Current phase: User research validation via web prototype
- Next phase: Hybrid mobile app development (React Native/Flutter)
- Progress tracking includes both technical and user research elements
- Emphasis on user pain points and market validation