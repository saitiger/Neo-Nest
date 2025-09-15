/**
 * Production Monitoring and Error Tracking Configuration
 */

export const MonitoringConfig = {
  // Crash Reporting
  crashlytics: {
    enabled: true,
    collectUserIds: false, // HIPAA compliance
    collectUserEmails: false, // HIPAA compliance
    customKeys: {
      appVersion: true,
      deviceType: true,
      osVersion: true,
      correctedAgeRange: true, // Non-PII milestone context
    },
  },

  // Performance Monitoring
  performance: {
    enabled: true,
    automaticScreenTracking: true,
    automaticNetworkTracking: true,
    customMetrics: {
      milestoneLoadTime: true,
      correctedAgeCalculation: true,
      communityPostLoad: true,
      profileSaveTime: true,
    },
  },

  // Analytics (Privacy-Compliant)
  analytics: {
    enabled: true,
    collectPersonalData: false,
    events: {
      milestoneLogged: true,
      correctedAgeViewed: true,
      communityPostCreated: true,
      contentViewed: true,
      playActivityStarted: true,
    },
    customDimensions: {
      babyAgeRange: true, // Anonymized ranges
      userType: true, // parent/expert
      appSection: true,
    },
  },

  // Error Tracking
  errorTracking: {
    enabled: true,
    sampleRate: 1.0, // 100% for medical app
    beforeSend: (event) => {
      // Remove any PII/PHI from error reports
      if (event.user) {
        delete event.user.email;
        delete event.user.id;
        delete event.user.username;
      }
      
      // Sanitize error messages
      if (event.message) {
        event.message = event.message.replace(/\b[\w\.-]+@[\w\.-]+\.\w+\b/g, '[EMAIL]');
        event.message = event.message.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
      }
      
      return event;
    },
  },

  // Health Checks
  healthChecks: {
    enabled: true,
    interval: 300000, // 5 minutes
    endpoints: [
      '/api/health',
      '/api/auth/status',
      '/api/milestones/health',
    ],
    alerts: {
      responseTime: 5000, // 5 seconds
      errorRate: 0.05, // 5%
      availability: 0.999, // 99.9%
    },
  },

  // Security Monitoring
  security: {
    enabled: true,
    detectRootedDevices: true,
    detectDebugging: true,
    detectEmulators: true,
    logSecurityEvents: true,
    alertOnSuspiciousActivity: true,
  },

  // Compliance Logging
  compliance: {
    auditLogging: true,
    dataAccessLogging: true,
    retentionPeriod: 2555, // 7 years in days
    encryptLogs: true,
    logRotation: 'daily',
  },
};

export default MonitoringConfig;