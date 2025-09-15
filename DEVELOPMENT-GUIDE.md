# Neo-Nest Development Guide

## Project Overview

Neo-Nest is a mobile-first hybrid application designed for parents of preterm babies from NICU discharge through the toddler stage. This guide documents the development approach, agent hooks, coding logic, and cross-IDE compatibility for the current user research phase.

**Formal Requirements**: See [.kiro/specs/neo-nest-mvp/requirements.md](.kiro/specs/neo-nest-mvp/requirements.md) for detailed user stories and acceptance criteria covering all 8 core requirements.

## Current Build Status

### Development Phases Completed ✅

#### Phase 1: User Research & Validation (Complete ✅)
- **File**: `MVP/index.html`
- **Purpose**: User research validation and feedback collection
- **Status**: ✅ Research objectives achieved, core value proposition validated
- **Outcome**: Feature priorities established, market demand confirmed

#### Phase 2: React Native Foundation (Complete ✅)
- **Framework**: React Native 0.81.4 with TypeScript
- **Development Environment**: iOS/Android simulators configured
- **Testing Framework**: Jest configured with comprehensive test suite
- **Navigation**: React Navigation with bottom tabs

#### Phase 3: Core Utilities & Milestone System (Complete ✅)
- **Corrected Age Engine**: Comprehensive calculation utilities with 100% test coverage
- **Milestone Data**: Preterm-specific developmental milestones
- **Interactive Screens**: Home and Milestones screens with responsive design

#### Phase 4: Authentication System (Complete ✅)
- **Production-Ready Auth**: Login, registration, password recovery
- **Security Implementation**: JWT tokens, encrypted AsyncStorage, session management
- **Comprehensive UI**: Form validation, error handling, loading states

### Current Phase: Baby Profile System (In Progress 🚧)
- **Focus**: Baby profile creation and user onboarding
- **Integration**: Corrected age calculations with user profiles
- **Data Persistence**: Save baby profiles and milestone progress

**Achievement Summary**: 4 major phases completed, ~2,500 lines of code, production-ready authentication system. See [Development Achievements](ACHIEVEMENTS.md) for comprehensive progress tracking.
- **Dependencies**: AsyncStorage, Vector Icons, Date/Time Picker, Image Picker

#### 2. Core Functionality Foundation (Complete ✅)
- **Corrected Age Utilities**: Full calculation engine with comprehensive tests
- **Milestone Data Structure**: Preterm-specific milestone definitions
- **Basic Screens**: Home and Milestones screens with responsive design
- **Cross-Platform UI**: Consistent styling for iOS and Android

#### 3. Authentication System (Complete ✅)
- **User Registration**: Complete registration form with validation
- **Login System**: Secure authentication flow with error handling
- **Password Reset**: Forgot password functionality with email flow
- **Session Management**: JWT token handling with AsyncStorage
- **Authentication Context**: React Context for app-wide auth state
- **Navigation Flow**: Auth-aware navigation between login and main app
- **Test Coverage**: Comprehensive unit tests for auth utilities

#### 4. Next Development Phase (Starting)
- **Baby Profile Creation**: User onboarding and profile setup
- **Profile Management**: Edit and manage baby information
- **Data Persistence**: Enhanced AsyncStorage integration for user data

#### 2. Interactive JavaScript Logic (Complete)
- **File**: `MVP/script.js`
- **Purpose**: Handle user interactions and data collection
- **Key Functions**:
  - `showModal(modalId)` - Display feature details
  - `closeModal(modalId)` - Hide modal dialogs
  - `submitFeedback()` - Process user feedback forms
  - `exportResearchData()` - Export collected data for analysis
  - Event listeners for clicks, form submissions, and modal interactions

#### 3. Responsive Styling (Complete)
- **File**: `MVP/styles.css`
- **Purpose**: Mobile-first responsive design
- **Features**:
  - CSS Grid and Flexbox layouts
  - Mobile breakpoints (768px, 480px)
  - Accessible color scheme and typography
  - Smooth animations and transitions
  - Modal styling and overlay effects

#### 4. Documentation Suite (Complete)
- Comprehensive README files for each component
- Bug tracking and troubleshooting documentation
- Project structure and development guidelines
- AI steering rules for consistent development

## Agent Hooks Implementation

### Current Hooks Strategy

The project uses Kiro AI agent hooks for automated development tasks:

#### 1. Documentation Sync Hook
- **Trigger**: File save events on core files
- **Action**: Automatically update README files when code changes
- **Files Monitored**: `*.js`, `*.html`, `*.css`
- **Output**: Updated documentation in README.md files

#### 2. Bug Tracking Hook
- **Trigger**: Error detection or manual activation
- **Action**: Document bugs in `bug-fixes.md` with root cause analysis
- **Features**: Automatic error categorization and solution tracking

#### 3. Code Quality Hook (Planned)
- **Trigger**: Code file modifications
- **Action**: Run accessibility checks and performance audits
- **Output**: Quality reports and improvement suggestions

### Coding Logic and Architecture

#### Design Principles

1. **Mobile-First Approach**
   - All CSS written with mobile breakpoints first
   - Progressive enhancement for larger screens
   - Touch-friendly interface elements

2. **Vanilla JavaScript Strategy**
   - No external dependencies for MVP
   - Browser-native APIs only
   - Lightweight and fast loading

3. **Accessibility-First Design**
   - WCAG 2.1 AA compliance
   - Semantic HTML structure
   - Keyboard navigation support
   - Screen reader compatibility

4. **Data Collection Focus**
   - localStorage for client-side persistence
   - Structured data export functionality
   - User feedback tracking and analytics

#### Code Organization

```
MVP/
├── index.html          # Main page structure
├── script.js           # Interactive functionality
├── styles.css          # Responsive styling
├── README.md           # Component documentation
└── Getting Started.md  # Development notes
```

#### Key JavaScript Patterns

```javascript
// Modal Management Pattern
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Data Collection Pattern
function submitFeedback() {
    const formData = new FormData(document.getElementById('feedbackForm'));
    const data = Object.fromEntries(formData);
    
    // Store in localStorage
    const existingData = JSON.parse(localStorage.getItem('neoNestFeedback') || '[]');
    existingData.push({...data, timestamp: new Date().toISOString()});
    localStorage.setItem('neoNestFeedback', JSON.stringify(existingData));
}

// Export Functionality Pattern
window.exportNeoNestData = function() {
    const data = localStorage.getItem('neoNestFeedback');
    if (data) {
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'neo-nest-research-data.json';
        a.click();
    }
};
```

## Running and Debugging Across IDEs

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local file system access
- No server requirements for MVP

### IDE-Specific Instructions

#### Visual Studio Code
```bash
# Install Live Server extension (optional)
# Open project folder
# Right-click index.html → "Open with Live Server"
# Or simply double-click index.html
```

#### WebStorm/IntelliJ
```bash
# Open project folder
# Right-click MVP/index.html → "Open in Browser"
# Built-in server available at localhost:63342
```

#### Sublime Text
```bash
# Install Browser Sync package (optional)
# Open project folder
# Navigate to MVP/index.html in file explorer
# Double-click to open in default browser
```

#### Atom/Pulsar
```bash
# Install atom-live-server package (optional)
# Open project folder
# Right-click index.html → "Open in Browser"
```

#### Generic IDE/Text Editor
```bash
# Method 1: Direct file opening
cd Neo-Nest/MVP
# Double-click index.html or drag to browser

# Method 2: Simple HTTP server (if available)
python -m http.server 8000  # Python 3
# or
python -m SimpleHTTPServer 8000  # Python 2
# Navigate to http://localhost:8000/MVP/

# Method 3: Node.js server (if available)
npx serve .
# Navigate to provided localhost URL + /MVP/
```

### Debugging Instructions

#### Browser Developer Tools
1. **Open DevTools**: F12 or Right-click → "Inspect"
2. **Console Tab**: View JavaScript errors and logs
3. **Network Tab**: Monitor resource loading
4. **Application Tab**: Inspect localStorage data
5. **Elements Tab**: Debug CSS and HTML structure

#### Common Debugging Commands
```javascript
// In browser console:

// View collected feedback data
JSON.parse(localStorage.getItem('neoNestFeedback') || '[]')

// Export research data
exportNeoNestData()

// Clear stored data (for testing)
localStorage.removeItem('neoNestFeedback')

// Test modal functionality
showModal('tracker-modal')
closeModal('tracker-modal')
```

#### Troubleshooting Common Issues

1. **JavaScript Not Working**
   - Check browser console for errors
   - Ensure files are served from same domain (not file://)
   - Verify script.js is loading properly

2. **Styles Not Applied**
   - Check CSS file path in HTML
   - Verify no syntax errors in CSS
   - Test with browser cache disabled

3. **Modal Issues**
   - Ensure modal HTML structure is correct
   - Check JavaScript event listeners
   - Verify CSS display properties

4. **Data Not Persisting**
   - Check localStorage browser support
   - Verify domain consistency
   - Test with browser privacy settings

### Performance Monitoring

#### Key Metrics to Track
- Page load time (target: <2 seconds)
- JavaScript execution time
- CSS render blocking
- Mobile responsiveness scores

#### Testing Tools
- Chrome Lighthouse (built-in)
- Firefox Developer Tools
- Mobile device simulation
- Accessibility auditing tools

## Next Development Steps

### Immediate Priorities
1. User research data collection and analysis
2. Mobile app framework selection (React Native/Flutter)
3. Backend API design and implementation
4. User authentication system

### Technical Debt
- Add unit tests for JavaScript functions
- Implement error boundary handling
- Add form validation and sanitization
- Optimize images and assets for performance

### Future Enhancements
- Progressive Web App (PWA) capabilities
- Offline functionality
- Push notifications
- Advanced analytics integration

## Agent Hook Configuration

### Recommended Hooks for Development

1. **Auto-Test Hook**
   ```json
   {
     "name": "Auto Test Runner",
     "trigger": "file_save",
     "pattern": "*.js",
     "action": "Run accessibility and performance tests"
   }
   ```

2. **Documentation Updater**
   ```json
   {
     "name": "Doc Sync",
     "trigger": "file_save", 
     "pattern": "*.{js,html,css}",
     "action": "Update relevant README files"
   }
   ```

3. **Code Quality Checker**
   ```json
   {
     "name": "Quality Gate",
     "trigger": "manual",
     "action": "Run ESLint, accessibility audit, and performance check"
   }
   ```

This development guide serves as the single source of truth for understanding the Neo-Nest project architecture, debugging procedures, and development workflow across different environments.