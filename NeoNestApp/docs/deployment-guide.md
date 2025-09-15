# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Security Verification
```bash
npm run security:check
npm run security:audit
```

### 2. Testing
```bash
npm run test
npm run test:integration
npm run test:e2e:ios
npm run test:e2e:android
```

### 3. Code Quality
```bash
npm run lint
npm run test:coverage
```

## Android Release Build

### 1. Generate Release Keystore
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore neo-nest-release-key.keystore -alias neo-nest-release -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing
1. Copy `gradle.properties.example` to `gradle.properties`
2. Fill in your keystore details
3. Keep keystore file secure and backed up

### 3. Build Release APK
```bash
npm run build:android:release
```

### 4. Build Release Bundle (Recommended)
```bash
npm run build:android:bundle
```

### 5. Test Release Build
```bash
cd android
./gradlew installRelease
```

## iOS Release Build

### 1. Configure Xcode Project
1. Open `ios/NeoNestApp.xcworkspace` in Xcode
2. Select "NeoNestApp" project
3. Update Bundle Identifier: `com.neonest.app`
4. Set Version and Build numbers
5. Configure signing certificates

### 2. Archive for App Store
```bash
npm run build:ios:archive
```

### 3. Upload to App Store Connect
1. Open Xcode Organizer
2. Select archived build
3. Click "Distribute App"
4. Choose "App Store Connect"
5. Follow upload wizard

## Environment Configuration

### Production Environment Variables
```bash
export NODE_ENV=production
export API_BASE_URL=https://api.neo-nest.com
export SENTRY_DSN=your_sentry_dsn_here
export ENCRYPTION_KEY=your_encryption_key_here
```

### Security Configuration
- Enable certificate pinning
- Configure proper CORS settings
- Set up rate limiting
- Enable audit logging
- Configure data encryption

## App Store Submission

### iOS App Store

#### 1. App Store Connect Setup
1. Create app record in App Store Connect
2. Fill in app information and metadata
3. Upload screenshots and app preview videos
4. Set pricing and availability
5. Configure App Store Review Information

#### 2. Required Information
- App Name: Neo-Nest
- Bundle ID: com.neonest.app
- Category: Medical
- Content Rating: 4+
- Privacy Policy URL: https://neo-nest.com/privacy
- Support URL: https://neo-nest.com/support

#### 3. Review Guidelines Compliance
- Medical disclaimer prominently displayed
- No diagnostic or treatment features
- User-generated content moderation
- Privacy policy compliance
- Accessibility features implemented

### Google Play Store

#### 1. Play Console Setup
1. Create app in Google Play Console
2. Complete store listing information
3. Upload screenshots and feature graphic
4. Set content rating and target audience
5. Configure pricing and distribution

#### 2. Required Information
- App Name: Neo-Nest
- Package Name: com.neonest.app
- Category: Medical
- Content Rating: Everyone
- Privacy Policy URL: https://neo-nest.com/privacy
- Target SDK: 34 (Android 14)

#### 3. Release Management
1. Upload signed AAB file
2. Complete release notes
3. Set rollout percentage (start with 5-10%)
4. Monitor crash reports and user feedback
5. Gradually increase rollout

## Post-Deployment Monitoring

### 1. Crash Reporting
- Monitor Crashlytics/Sentry for crashes
- Set up alerts for critical errors
- Review and fix issues promptly

### 2. Performance Monitoring
- Track app launch times
- Monitor API response times
- Watch memory and battery usage
- Review user engagement metrics

### 3. Security Monitoring
- Monitor for security incidents
- Review audit logs regularly
- Check for unauthorized access attempts
- Validate data encryption integrity

### 4. User Feedback
- Monitor app store reviews
- Track support ticket volume
- Analyze user behavior patterns
- Plan updates based on feedback

## Rollback Procedures

### Emergency Rollback
1. Remove app from store (if critical security issue)
2. Push hotfix update immediately
3. Communicate with users via in-app messaging
4. Document incident for post-mortem

### Gradual Rollback
1. Reduce rollout percentage in Play Console
2. Prepare previous version for re-release
3. Communicate issues to users
4. Plan fix and re-deployment

## Compliance Maintenance

### HIPAA Compliance
- Regular security audits
- Staff training updates
- Business Associate Agreement reviews
- Incident response plan testing

### App Store Compliance
- Monitor guideline updates
- Regular compliance reviews
- Update privacy policies as needed
- Maintain medical disclaimers

### Legal Compliance
- Regular legal review of terms
- Privacy policy updates
- Regulatory compliance monitoring
- International law considerations

## Support and Maintenance

### Regular Updates
- Security patches monthly
- Feature updates quarterly
- Content updates as needed
- Performance optimizations

### Monitoring Schedule
- Daily: Crash reports and critical errors
- Weekly: Performance metrics and user feedback
- Monthly: Security audit and compliance review
- Quarterly: Full system health check