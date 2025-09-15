/**
 * Production Environment Configuration
 * Security-focused settings for app store release
 */

export const ProductionConfig = {
  // API Configuration
  API_BASE_URL: 'https://api.neo-nest.com',
  API_TIMEOUT: 10000,
  
  // Security Settings
  ENABLE_FLIPPER: false,
  ENABLE_DEV_MENU: false,
  ENABLE_REMOTE_DEBUGGING: false,
  
  // Analytics & Monitoring
  ENABLE_CRASHLYTICS: true,
  ENABLE_ANALYTICS: true,
  SENTRY_DSN: process.env.SENTRY_DSN,
  
  // Feature Flags
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: true,
  
  // Data Protection
  ENCRYPTION_ENABLED: true,
  SECURE_STORAGE_ENABLED: true,
  
  // App Store Compliance
  PRIVACY_POLICY_URL: 'https://neo-nest.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://neo-nest.com/terms',
  SUPPORT_EMAIL: 'support@neo-nest.com',
  
  // Performance
  BUNDLE_SIZE_LIMIT: '50MB',
  IMAGE_COMPRESSION_QUALITY: 0.8,
  CACHE_DURATION: 86400000, // 24 hours
};

export default ProductionConfig;