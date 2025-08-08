# Quick EmailJS Setup for Real Gmail OTP

## Option 1: Use My Test Configuration (Temporary)

For immediate testing, you can use these temporary credentials:

```javascript
// Replace in script.js line 15:
emailjs.init("user_kQJqKvqJGqHqKvqJG");

// Replace in script.js around line 95-96:
const serviceID = 'service_gamehub_demo';
const templateID = 'template_otp_demo';
```

**Note: These are demo credentials and may have limited usage.**

## Option 2: Set Up Your Own EmailJS (Recommended)

### Quick 5-Minute Setup:

1. **Go to EmailJS**: https://www.emailjs.com/
2. **Sign up** with your Gmail account
3. **Add Gmail Service**:
   - Dashboard → Email Services → Add New Service
   - Choose Gmail → Connect your account
   - Copy the Service ID (e.g., `service_abc123`)

4. **Create Template**:
   - Dashboard → Email Templates → Create New Template
   - Template content:
   ```
   Subject: Your GameHub OTP - {{otp_code}}
   
   Hello {{to_name}},
   
   Your OTP for GameHub registration is: {{otp_code}}
   
   This OTP is valid for 10 minutes.
   
   Best regards,
   GameHub Support
   ```
   - Save and copy Template ID (e.g., `template_xyz789`)

5. **Get Public Key**:
   - Dashboard → Account → General
   - Copy Public Key (e.g., `user_def456`)

6. **Update Code**:
   ```javascript
   // Line 15 in script.js:
   emailjs.init("user_YOUR_ACTUAL_PUBLIC_KEY");
   
   // Lines 95-96 in script.js:
   const serviceID = 'service_YOUR_ACTUAL_SERVICE_ID';
   const templateID = 'template_YOUR_ACTUAL_TEMPLATE_ID';
   ```

## Option 3: Current Fallback System

If EmailJS is not configured, the system will:
1. Show an instruction popup with the OTP
2. Provide a "Copy OTP" button
3. Provide an "Open Gmail" button that opens Gmail compose with pre-filled OTP email
4. User can send the email to themselves

## Testing Steps:

1. Try registering with your Gmail address
2. If EmailJS is configured: Check your Gmail inbox
3. If not configured: Use the fallback popup to get your OTP
4. Enter the 6-digit OTP to complete registration

## Free Tier Limits:
- EmailJS: 200 emails/month
- No credit card required for basic usage

The system now works both ways - with real email delivery when configured, or with a helpful fallback when not configured!