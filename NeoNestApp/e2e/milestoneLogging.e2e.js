describe('Milestone Logging E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
    
    // Complete registration and baby profile setup
    await element(by.id('welcome-register-button')).tap();
    await element(by.id('register-email-input')).typeText('milestone@example.com');
    await element(by.id('register-password-input')).typeText('SecurePass123!');
    await element(by.id('register-confirm-password-input')).typeText('SecurePass123!');
    await element(by.id('register-parent-name-input')).typeText('Milestone Tester');
    await element(by.id('register-submit-button')).tap();
    
    // Create baby profile
    await element(by.id('baby-name-input')).typeText('Test Baby');
    await element(by.id('birth-date-picker')).tap();
    // Select a date (implementation depends on date picker component)
    await element(by.text('OK')).tap();
    await element(by.id('due-date-picker')).tap();
    await element(by.text('OK')).tap();
    await element(by.id('save-baby-profile-button')).tap();
  });

  beforeEach(async () => {
    // Navigate to milestones screen
    await element(by.id('milestones-tab')).tap();
  });

  it('should log a milestone successfully', async () => {
    // Find and tap on a milestone to log
    await element(by.id('milestone-social-smile')).tap();
    
    // Should open milestone detail screen
    await expect(element(by.id('milestone-detail-screen'))).toBeVisible();
    
    // Tap log milestone button
    await element(by.id('log-milestone-button')).tap();
    
    // Fill milestone logging form
    await element(by.id('achievement-date-picker')).tap();
    await element(by.text('OK')).tap();
    
    await element(by.id('milestone-notes-input')).typeText('Baby smiled during feeding time');
    
    // Submit milestone log
    await element(by.id('save-milestone-button')).tap();
    
    // Should show success message
    await expect(element(by.id('milestone-logged-success'))).toBeVisible();
    
    // Should update milestone status
    await expect(element(by.id('milestone-status-achieved'))).toBeVisible();
  });

  it('should display milestone progress correctly', async () => {
    // Navigate to milestone progress view
    await element(by.id('milestone-progress-tab')).tap();
    
    // Should show progress indicators
    await expect(element(by.id('progress-on-track'))).toBeVisible();
    await expect(element(by.id('progress-watch'))).toBeVisible();
    await expect(element(by.id('progress-delayed'))).toBeVisible();
    
    // Should show corrected age
    await expect(element(by.id('corrected-age-display'))).toBeVisible();
  });

  it('should filter milestones by age range', async () => {
    // Open age filter
    await element(by.id('age-filter-button')).tap();
    
    // Select specific age range
    await element(by.id('age-range-0-3-months')).tap();
    await element(by.id('apply-filter-button')).tap();
    
    // Should show only milestones for selected age range
    await expect(element(by.id('milestone-social-smile'))).toBeVisible();
    await expect(element(by.id('milestone-walking'))).not.toBeVisible();
  });

  it('should export milestone report', async () => {
    // Navigate to milestone progress
    await element(by.id('milestone-progress-tab')).tap();
    
    // Tap export button
    await element(by.id('export-milestone-report-button')).tap();
    
    // Should show export options
    await expect(element(by.id('export-options-modal'))).toBeVisible();
    
    // Select PDF export
    await element(by.id('export-pdf-option')).tap();
    
    // Should show success message
    await expect(element(by.id('export-success-message'))).toBeVisible();
  });

  it('should handle milestone photo upload', async () => {
    await element(by.id('milestone-social-smile')).tap();
    await element(by.id('log-milestone-button')).tap();
    
    // Tap add photo button
    await element(by.id('add-photo-button')).tap();
    
    // Should show photo options
    await expect(element(by.id('photo-options-modal'))).toBeVisible();
    
    // Select camera option (in test environment, this would be mocked)
    await element(by.id('camera-option')).tap();
    
    // Mock photo selection
    await expect(element(by.id('photo-preview'))).toBeVisible();
    
    // Save milestone with photo
    await element(by.id('save-milestone-button')).tap();
    
    await expect(element(by.id('milestone-logged-success'))).toBeVisible();
  });
});