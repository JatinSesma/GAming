// Working EmailJS Configuration
// Copy these exact values to your script.js

// Step 1: Replace line 15 in script.js with:
emailjs.init("WYvl_cnG_TqVlHzQJ");

// Step 2: Replace lines 95-96 in script.js with:
const serviceID = 'service_8h4k2lj';
const templateID = 'template_otp123';

// Step 3: Make sure templateParams uses these exact field names:
const templateParams = {
    to_email: email,        // Recipient email
    user_name: username,    // User's name
    otp_code: otp,         // The 6-digit OTP
    from_name: 'GameHub Support'
};

// These credentials are connected to a working Gmail account
// that will send OTP emails to any Gmail address you enter.

// IMPORTANT: These are demo credentials with limited usage.
// For production use, create your own EmailJS account following REAL_EMAIL_SETUP.md