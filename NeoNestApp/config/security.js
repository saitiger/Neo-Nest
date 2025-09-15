/**
 * Security Configuration for Production
 * HIPAA/GDPR compliance settings
 */

export const SecurityConfig = {
  // Encryption Settings
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  KEY_DERIVATION: 'PBKDF2',
  SALT_ROUNDS: 10000,
  
  // Session Management
  SESSION_TIMEOUT: 1800000, // 30 minutes
  REFRESH_TOKEN_EXPIRY: 604800000, // 7 days
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes
  
  // Data Protection
  PII_ENCRYPTION_REQUIRED: true,
  PHI_ENCRYPTION_REQUIRED: true,
  DATA_RETENTION_DAYS: 2555, // 7 years for medical data
  
  // Network Security
  CERTIFICATE_PINNING: true,
  TLS_VERSION: '1.3',
  HSTS_ENABLED: true,
  
  // App Security
  ROOT_DETECTION: true,
  JAILBREAK_DETECTION: true,
  DEBUGGER_DETECTION: true,
  SCREENSHOT_PREVENTION: true,
  
  // Compliance
  HIPAA_COMPLIANCE: true,
  GDPR_COMPLIANCE: true,
  COPPA_COMPLIANCE: true,
  
  // Audit Logging
  AUDIT_LOG_ENABLED: true,
  LOG_RETENTION_DAYS: 2555,
  SENSITIVE_DATA_MASKING: true,
};

export default SecurityConfig;