#!/usr/bin/env node

/**
 * Security Check Script for Production Builds
 * Validates security configurations before release
 */

const fs = require('fs');
const path = require('path');

class SecurityChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  checkFile(filePath, description) {
    if (!fs.existsSync(filePath)) {
      this.errors.push(`Missing required file: ${filePath} (${description})`);
      return false;
    }
    return true;
  }

  checkPackageJson() {
    console.log('🔍 Checking package.json security...');
    
    const packagePath = path.join(__dirname, '../package.json');
    if (!this.checkFile(packagePath, 'Package configuration')) return;

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check for development dependencies in production
    if (packageJson.dependencies) {
      const devDeps = ['flipper', 'reactotron', 'debug'];
      devDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
          this.warnings.push(`Development dependency found in production: ${dep}`);
        }
      });
    }

    // Check version
    if (!packageJson.version || packageJson.version === '0.0.1') {
      this.errors.push('Package version should be updated for production release');
    }
  }

  checkAppJson() {
    console.log('🔍 Checking app.json configuration...');
    
    const appJsonPath = path.join(__dirname, '../app.json');
    if (!this.checkFile(appJsonPath, 'App configuration')) return;

    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // Check for production settings
    if (appJson.expo) {
      if (!appJson.expo.version || appJson.expo.version === '1.0.0') {
        this.warnings.push('Consider updating app version for release');
      }
      
      if (!appJson.expo.ios?.bundleIdentifier) {
        this.errors.push('iOS bundle identifier not configured');
      }
      
      if (!appJson.expo.android?.package) {
        this.errors.push('Android package name not configured');
      }
    }
  }

  checkSecurityConfig() {
    console.log('🔍 Checking security configuration...');
    
    const securityConfigPath = path.join(__dirname, '../config/security.js');
    if (!this.checkFile(securityConfigPath, 'Security configuration')) return;

    // Check for required security files
    const requiredConfigs = [
      '../config/production.js',
      '../config/monitoring.js'
    ];

    requiredConfigs.forEach(config => {
      const configPath = path.join(__dirname, config);
      this.checkFile(configPath, `Configuration file: ${config}`);
    });
  }

  checkEnvironmentVariables() {
    console.log('🔍 Checking environment variables...');
    
    const requiredEnvVars = [
      'NODE_ENV',
      'API_BASE_URL',
      'SENTRY_DSN'
    ];

    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        this.warnings.push(`Environment variable not set: ${envVar}`);
      }
    });
  }

  checkAndroidSecurity() {
    console.log('🔍 Checking Android security settings...');
    
    const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');
    if (!this.checkFile(buildGradlePath, 'Android build configuration')) return;

    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Check for debug settings in release
    if (buildGradle.includes('debuggable true') && !buildGradle.includes('buildTypes')) {
      this.errors.push('Debuggable flag should not be enabled in release builds');
    }

    // Check for proper signing configuration
    if (!buildGradle.includes('signingConfigs')) {
      this.warnings.push('Signing configuration should be properly set for release');
    }
  }

  checkiOSSecurity() {
    console.log('🔍 Checking iOS security settings...');
    
    const infoPlistPath = path.join(__dirname, '../ios/NeoNestApp/Info.plist');
    if (!this.checkFile(infoPlistPath, 'iOS Info.plist')) return;

    const infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
    
    // Check for App Transport Security
    if (!infoPlist.includes('NSAppTransportSecurity')) {
      this.warnings.push('App Transport Security should be configured');
    }

    // Check for usage descriptions
    const requiredUsageDescriptions = [
      'NSCameraUsageDescription',
      'NSPhotoLibraryUsageDescription',
      'NSLocationWhenInUseUsageDescription'
    ];

    requiredUsageDescriptions.forEach(desc => {
      if (!infoPlist.includes(desc)) {
        this.warnings.push(`Missing usage description: ${desc}`);
      }
    });
  }

  checkHIPAACompliance() {
    console.log('🔍 Checking HIPAA compliance requirements...');
    
    // Check for encryption configuration
    const securityConfigPath = path.join(__dirname, '../config/security.js');
    if (fs.existsSync(securityConfigPath)) {
      const securityConfig = fs.readFileSync(securityConfigPath, 'utf8');
      
      if (!securityConfig.includes('ENCRYPTION_ENABLED: true')) {
        this.errors.push('Encryption must be enabled for HIPAA compliance');
      }
      
      if (!securityConfig.includes('AUDIT_LOG_ENABLED: true')) {
        this.errors.push('Audit logging must be enabled for HIPAA compliance');
      }
    }
  }

  run() {
    console.log('🛡️  Running security checks for production build...\n');
    
    this.checkPackageJson();
    this.checkAppJson();
    this.checkSecurityConfig();
    this.checkEnvironmentVariables();
    this.checkAndroidSecurity();
    this.checkiOSSecurity();
    this.checkHIPAACompliance();
    
    console.log('\n📊 Security Check Results:');
    console.log(`✅ Checks completed`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}\n`);
    
    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
      console.log('');
    }
    
    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`   • ${error}`));
      console.log('');
      console.log('🚫 Security check failed. Please fix errors before proceeding with release.');
      process.exit(1);
    }
    
    console.log('✅ Security check passed! Ready for production build.');
  }
}

// Run security check
const checker = new SecurityChecker();
checker.run();