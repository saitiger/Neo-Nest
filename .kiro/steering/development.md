# Development Workflow

## Architecture Principles
- **Hybrid Mobile**: Target platforms are iOS and Android devices
- **Current Phase**: Web prototype for user research validation
- **Next Phase**: React Native/Flutter hybrid mobile development
- **Accessibility-First**: Cross-platform accessibility guidelines compliance required
- **Research Phase**: Browser-based prototype for concept validation

## Code Patterns
- Modal management with proper accessibility
- localStorage for client-side data persistence
- Structured data export functionality
- Event-driven user interaction handling

## Testing Requirements
- **Current Phase**: Browser environment for web prototype testing
- **Hybrid Phase**: Platform simulators/emulators for both iOS and Android
- **Cross-Platform**: Ensure consistent design patterns across platforms
- **Accessibility**: VoiceOver (iOS) and TalkBack (Android) testing

## Documentation Standards
- Comprehensive development guide maintained in DEVELOPMENT-GUIDE.md
- Bug tracking with root cause analysis in bug-fixes.md
- Component-specific README files for each major section
- Cross-references between related documentation

## Performance Targets
- Page load time: <2 seconds
- JavaScript execution: Minimal blocking
- Mobile responsiveness: All breakpoints
- Accessibility: WCAG 2.1 AA compliance

## Common Issues to Avoid
- Running browser JavaScript directly with Node.js
- Missing cross-references in documentation updates
- Inconsistent mobile-first CSS approach
- Accessibility violations in interactive elements