describe('Community Interaction E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
    
    // Complete user setup
    await element(by.id('welcome-register-button')).tap();
    await element(by.id('register-email-input')).typeText('community@example.com');
    await element(by.id('register-password-input')).typeText('SecurePass123!');
    await element(by.id('register-confirm-password-input')).typeText('SecurePass123!');
    await element(by.id('register-parent-name-input')).typeText('Community Tester');
    await element(by.id('register-submit-button')).tap();
    
    // Quick baby profile setup
    await element(by.id('baby-name-input')).typeText('Community Baby');
    await element(by.id('birth-date-picker')).tap();
    await element(by.text('OK')).tap();
    await element(by.id('due-date-picker')).tap();
    await element(by.text('OK')).tap();
    await element(by.id('save-baby-profile-button')).tap();
  });

  beforeEach(async () => {
    // Navigate to community screen
    await element(by.id('community-tab')).tap();
  });

  it('should create a new forum post', async () => {
    // Tap create post button
    await element(by.id('create-post-button')).tap();
    
    // Should open create post screen
    await expect(element(by.id('create-post-screen'))).toBeVisible();
    
    // Fill post form
    await element(by.id('post-title-input')).typeText('Need advice on sleep schedule');
    await element(by.id('post-content-input')).typeText('My preterm baby is having trouble sleeping through the night. Any suggestions?');
    
    // Select category
    await element(by.id('category-picker')).tap();
    await element(by.text('Sleep & Feeding')).tap();
    
    // Submit post
    await element(by.id('submit-post-button')).tap();
    
    // Should show pending moderation message
    await expect(element(by.id('post-pending-message'))).toBeVisible();
    
    // Should return to community screen
    await expect(element(by.id('community-screen'))).toBeVisible();
  });

  it('should browse and filter community posts', async () => {
    // Should show list of posts
    await expect(element(by.id('community-posts-list'))).toBeVisible();
    
    // Open category filter
    await element(by.id('category-filter-button')).tap();
    
    // Select specific category
    await element(by.text('Sleep & Feeding')).tap();
    await element(by.id('apply-filter-button')).tap();
    
    // Should show filtered posts
    await expect(element(by.id('filtered-posts-list'))).toBeVisible();
    
    // Clear filter
    await element(by.id('clear-filter-button')).tap();
    
    // Should show all posts again
    await expect(element(by.id('community-posts-list'))).toBeVisible();
  });

  it('should view post details and add reply', async () => {
    // Tap on a post
    await element(by.id('post-item-0')).tap();
    
    // Should open post detail screen
    await expect(element(by.id('post-detail-screen'))).toBeVisible();
    
    // Should show post content
    await expect(element(by.id('post-content'))).toBeVisible();
    
    // Scroll to replies section
    await element(by.id('post-detail-scroll')).scrollTo('bottom');
    
    // Tap add reply button
    await element(by.id('add-reply-button')).tap();
    
    // Fill reply form
    await element(by.id('reply-content-input')).typeText('I had similar issues. Try establishing a consistent bedtime routine.');
    
    // Submit reply
    await element(by.id('submit-reply-button')).tap();
    
    // Should show pending moderation message
    await expect(element(by.id('reply-pending-message'))).toBeVisible();
  });

  it('should like and unlike posts', async () => {
    // Tap on a post
    await element(by.id('post-item-0')).tap();
    
    // Tap like button
    await element(by.id('like-post-button')).tap();
    
    // Should show liked state
    await expect(element(by.id('post-liked-indicator'))).toBeVisible();
    
    // Tap unlike button
    await element(by.id('like-post-button')).tap();
    
    // Should show unliked state
    await expect(element(by.id('post-liked-indicator'))).not.toBeVisible();
  });

  it('should search community posts', async () => {
    // Tap search button
    await element(by.id('search-posts-button')).tap();
    
    // Enter search query
    await element(by.id('search-input')).typeText('sleep');
    
    // Submit search
    await element(by.id('search-submit-button')).tap();
    
    // Should show search results
    await expect(element(by.id('search-results-list'))).toBeVisible();
    
    // Clear search
    await element(by.id('clear-search-button')).tap();
    
    // Should return to all posts
    await expect(element(by.id('community-posts-list'))).toBeVisible();
  });

  it('should report inappropriate content', async () => {
    // Tap on a post
    await element(by.id('post-item-0')).tap();
    
    // Tap options menu
    await element(by.id('post-options-button')).tap();
    
    // Select report option
    await element(by.text('Report Post')).tap();
    
    // Should show report modal
    await expect(element(by.id('report-modal'))).toBeVisible();
    
    // Select report reason
    await element(by.id('report-reason-inappropriate')).tap();
    
    // Add report details
    await element(by.id('report-details-input')).typeText('This content is not appropriate for the community');
    
    // Submit report
    await element(by.id('submit-report-button')).tap();
    
    // Should show confirmation message
    await expect(element(by.id('report-submitted-message'))).toBeVisible();
  });

  it('should handle expert replies display', async () => {
    // Navigate to a post with expert replies (mock data)
    await element(by.id('post-with-expert-reply')).tap();
    
    // Should show expert badge
    await expect(element(by.id('expert-badge'))).toBeVisible();
    
    // Should show expert credentials
    await expect(element(by.id('expert-credentials'))).toBeVisible();
    
    // Expert reply should be highlighted
    await expect(element(by.id('expert-reply-highlight'))).toBeVisible();
  });
});