# Neo-Nest MVP Home Page

A minimal home page for user research and validation of the Neo-Nest concept.

## Purpose

This home page is designed to:
- Test the core value proposition with potential users
- Collect user feedback on pain points and desired features
- Gather email addresses for launch notifications
- Validate market demand before full development

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

1. Open `index.html` in a web browser
2. Share with potential users (preterm parents, NICU families)
3. Collect feedback through the interactive elements
4. Export research data using `exportNeoNestData()` in browser console

## Research Data Export

To view collected research data, open browser console and run:
```javascript
exportNeoNestData()
```

This returns all collected user feedback, interests, and engagement data.

## Next Steps

Based on user research results:
1. Analyze most common pain points and feature requests
2. Validate demand through email signup conversion
3. Refine product positioning and feature prioritization
4. Begin MVP development with validated features

## Technical Notes

- Mobile-first responsive design
- No external dependencies
- Uses localStorage for data persistence
- Ready for integration with analytics tools
- Accessible design following WCAG guidelines