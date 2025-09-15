describe('User Registration E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete user registration flow', async () => {
    // Navigate to registration screen
    await element(by.id('welcome-register-button')).tap();
    
    // Fill registration form
    await element(by.id('register-email-input')).typeText('test@example.com');
    await element(by.id('register-password-input')).typeText('SecurePass123!');
    await element(by.id('register-confirm-password-input')).typeText('SecurePass123!');
    await element(by.id('register-parent-name-input')).typeText('John Doe');
    
    // Submit registration
    await element(by.id('register-submit-button')).tap();
    
    // Should navigate to baby profile creation
    await expect(element(by.id('baby-profile-screen'))).toBeVisible();
  });

  it('should show validation errors for invalid registration data', async () => {
    await element(by.id('welcome-register-button')).tap();
    
    // Try to submit with invalid email
    await element(by.id('register-email-input')).typeText('invalid-email');
    await element(by.id('register-password-input')).typeText('weak');
    await element(by.id('register-submit-button')).tap();
    
    // Should show validation errors
    await expect(element(by.id('email-error-message'))).toBeVisible();
    await expect(element(by.id('password-error-message'))).toBeVisible();
  });

  it('should handle network errors gracefully', async () => {
    // Simulate network failure
    await device.setURLBlacklist(['*']);
    
    await element(by.id('welcome-register-button')).tap();
    
    await element(by.id('register-email-input')).typeText('test@example.com');
    await element(by.id('register-password-input')).typeText('SecurePass123!');
    await element(by.id('register-confirm-password-input')).typeText('SecurePass123!');
    await element(by.id('register-parent-name-input')).typeText('John Doe');
    
    await element(by.id('register-submit-button')).tap();
    
    // Should show network error message
    await expect(element(by.id('network-error-message'))).toBeVisible();
    
    // Reset network
    await device.setURLBlacklist([]);
  });
});