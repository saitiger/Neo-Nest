# Neo-Nest MVP Home Page

A minimal home page for user research and validation of the Neo-Nest concept.

## Purpose

This home page was designed to:
- ✅ Test the core value proposition with potential users
- ✅ Collect user feedback on pain points and desired features
- ✅ Gather email addresses for launch notifications
- ✅ Validate market demand before full development
- ✅ Research user needs to inform the 8 core requirements detailed in [.kiro/specs/neo-nest-mvp/requirements.md](../.kiro/specs/neo-nest-mvp/requirements.md)

**Status**: ✅ **User research phase completed successfully**. Project has transitioned to hybrid mobile app development with 4 major phases completed. See [Development Achievements](../ACHIEVEMENTS.md) for comprehensive progress tracking.

## Features

### Core Messaging
- Clear value proposition for preterm parents
- Highlights key differentiators (corrected age tracking, doctor-backed content, moderated community)
- Empathetic tone that acknowledges preterm parent challenges

### User Research Components
- **Worry Assessment**: Identifies top concerns of preterm parents
- **Feature Validation**: Tests which features would be most valuable
- **Interest Capture**: Collects emails for launch notifications
- **Open Feedback**: Allows detailed user input

### Data Collection
All user interactions are stored in localStorage for analysis:
- Email signups
- Feature preferences
- Detailed feedback
- Page views and engagement

## Files

- `index.html` - Main home page structure
- `styles.css` - Responsive styling with mobile-first approach
- `script.js` - User interaction handling and data collection
- `README.md` - This documentation

## Usage

1. Open `index.html` in a web browser (double-click the file or serve locally)
2. Share with potential users (preterm parents, NICU families)
3. Collect feedback through the interactive elements
4. Export research data using `exportNeoNestData()` in browser console

### Important: Browser Environment Required

The JavaScript files are designed for browser execution and require DOM APIs (`window`, `document`, `localStorage`). Do not attempt to run `script.js` directly with Node.js as it will result in `ReferenceError: window is not defined`.

## Research Data Export

To view collected research data, open browser console and run:
```javascript
exportNeoNestData()
```

This returns all collected user feedback, interests, and engagement data.

## Research Results & Next Steps

✅ **User research objectives achieved:**
1. ✅ Core value proposition validated with target users
2. ✅ Pain points and feature preferences collected
3. ✅ Market demand confirmed through user engagement
4. ✅ Feature prioritization informed mobile development

**Current Development Status:**
- ✅ **Phase 1**: User Research & Validation (Complete)
- ✅ **Phase 2**: React Native Foundation (Complete)
- ✅ **Phase 3**: Core Utilities & Milestone System (Complete)
- ✅ **Phase 4**: Authentication System (Complete)
- 🚧 **Phase 5**: Baby Profile System (In Progress)

See [Development Achievements](../ACHIEVEMENTS.md) for detailed technical accomplishments and progress tracking.

## Technical Notes

- Mobile-first responsive design
- No external dependencies
- Uses localStorage for data persistence
- Ready for integration with analytics tools
- Accessible design following WCAG guidelines
- Browser-only execution (requires DOM APIs)

For detailed development workflow, IDE setup, and debugging instructions, see the [Development Guide](../DEVELOPMENT-GUIDE.md).

## Troubleshooting

### Common Issues

**Error: `Uncaught ReferenceError: window is not defined`**
- **Cause**: Attempting to run `script.js` directly with Node.js
- **Solution**: Open `index.html` in a web browser instead
- **Why**: The script uses browser-specific APIs (`window`, `document`, `localStorage`) not available in Node.js

For detailed troubleshooting information, see `../bug-fixes.md`.