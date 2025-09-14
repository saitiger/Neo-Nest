// Neo-Nest Home Page JavaScript

// User research data collection
let userFeedback = {
    worries: [],
    helps: [],
    email: '',
    detailedFeedback: ''
};

// Show interest modal
function showInterest() {
    document.getElementById('interestModal').style.display = 'block';
}

// Show feedback modal
function showFeedback() {
    document.getElementById('feedbackModal').style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Submit email for interest
function submitEmail() {
    const email = document.getElementById('emailInput').value;
    if (email && validateEmail(email)) {
        userFeedback.email = email;
        
        // Store in localStorage for now (in real app, send to backend)
        localStorage.setItem('neoNestInterest', JSON.stringify({
            email: email,
            timestamp: new Date().toISOString()
        }));
        
        alert('Thanks! We\'ll notify you when Neo-Nest launches.');
        closeModal('interestModal');
        
        // Track interest (placeholder for analytics)
        console.log('Interest registered:', email);
    } else {
        alert('Please enter a valid email address.');
    }
}

// Submit detailed feedback
function submitDetailedFeedback() {
    const feedback = document.getElementById('feedbackText').value;
    if (feedback.trim()) {
        userFeedback.detailedFeedback = feedback;
        
        // Store feedback
        const existingFeedback = JSON.parse(localStorage.getItem('neoNestFeedback') || '[]');
        existingFeedback.push({
            feedback: feedback,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('neoNestFeedback', JSON.stringify(existingFeedback));
        
        alert('Thank you for your feedback! This helps us build a better product for preterm parents.');
        closeModal('feedbackModal');
        
        // Track feedback submission
        console.log('Feedback submitted:', feedback);
    } else {
        alert('Please share your thoughts before submitting.');
    }
}

// Submit research feedback
function submitFeedback() {
    // Collect checked worries
    const worryCheckboxes = document.querySelectorAll('input[name="worry"]:checked');
    userFeedback.worries = Array.from(worryCheckboxes).map(cb => cb.value);
    
    // Collect checked helps
    const helpCheckboxes = document.querySelectorAll('input[name="help"]:checked');
    userFeedback.helps = Array.from(helpCheckboxes).map(cb => cb.value);
    
    if (userFeedback.worries.length === 0 && userFeedback.helps.length === 0) {
        alert('Please select at least one option to help us understand your needs.');
        return;
    }
    
    // Store research data
    const researchData = {
        worries: userFeedback.worries,
        helps: userFeedback.helps,
        timestamp: new Date().toISOString()
    };
    
    const existingResearch = JSON.parse(localStorage.getItem('neoNestResearch') || '[]');
    existingResearch.push(researchData);
    localStorage.setItem('neoNestResearch', JSON.stringify(existingResearch));
    
    // Show thank you message
    alert('Thank you for sharing! Your input helps us prioritize the right features for preterm parents.');
    
    // Clear selections
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Track research submission
    console.log('Research data collected:', researchData);
    
    // Show interest modal as follow-up
    setTimeout(() => {
        showInterest();
    }, 1000);
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Track page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Neo-Nest home page loaded');
    
    // Track page view (placeholder for analytics)
    const pageView = {
        page: 'home',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    const existingViews = JSON.parse(localStorage.getItem('neoNestPageViews') || '[]');
    existingViews.push(pageView);
    localStorage.setItem('neoNestPageViews', JSON.stringify(existingViews));
});

// Function to export research data (for development/testing)
function exportResearchData() {
    const data = {
        interests: JSON.parse(localStorage.getItem('neoNestInterest') || 'null'),
        feedback: JSON.parse(localStorage.getItem('neoNestFeedback') || '[]'),
        research: JSON.parse(localStorage.getItem('neoNestResearch') || '[]'),
        pageViews: JSON.parse(localStorage.getItem('neoNestPageViews') || '[]')
    };
    
    console.log('Neo-Nest Research Data:', data);
    return data;
}

// Make export function available globally for testing
window.exportNeoNestData = exportResearchData;