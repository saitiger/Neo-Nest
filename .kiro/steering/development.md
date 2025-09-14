# Development Workflow

## Architecture Principles
- **Mobile-First**: All development starts with mobile breakpoints
- **Vanilla JavaScript**: No external dependencies for MVP phase
- **Accessibility-First**: WCAG 2.1 AA compliance required
- **Browser-Only**: JavaScript designed for DOM APIs, not Node.js execution

## Code Patterns
- Modal management with proper accessibility
- localStorage for client-side data persistence
- Structured data export functionality
- Event-driven user interaction handling

## Testing Requirements
- Browser environment required for JavaScript execution
- Cross-IDE compatibility (VS Code, WebStorm, Sublime, etc.)
- Mobile responsiveness testing
- Accessibility auditing with browser tools

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