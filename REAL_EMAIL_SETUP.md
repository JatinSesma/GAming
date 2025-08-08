# Real Gmail OTP Setup - Step by Step

To send OTP to actual Gmail accounts, follow these exact steps:

## Step 1: Create EmailJS Account (2 minutes)
1. Go to: https://www.emailjs.com/
2. Click "Sign Up" 
3. Use your Gmail account to sign up
4. Verify your email

## Step 2: Add Gmail Service (1 minute)
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select "Gmail"
4. Click "Connect Account" and authorize your Gmail
5. Copy the Service ID (looks like: service_abc123)

## Step 3: Create Email Template (2 minutes)
1. Go to "Email Templates"
2. Click "Create New Template"
3. Set these fields:

**Template Name:** GameHub OTP
**Subject:** Your GameHub OTP - {{otp_code}}

**Content:**
```
Hello {{to_name}},

Welcome to GameHub!

Your OTP for registration is: {{otp_code}}

This OTP is valid for 10 minutes. Please do not share this code with anyone.

If you didn't request this, please ignore this email.

Best regards,
GameHub Support Team
```

4. Save and copy the Template ID (looks like: template_xyz789)

## Step 4: Get Public Key (30 seconds)
1. Go to "Account" → "General"
2. Copy your Public Key (looks like: user_def456ghi)

## Step 5: Update Code (1 minute)
Replace these 3 lines in script.js:

**Line 15:**
```javascript
emailjs.init("YOUR_ACTUAL_PUBLIC_KEY_HERE");
```

**Line 95:**
```javascript
const serviceID = 'YOUR_ACTUAL_SERVICE_ID_HERE';
```

**Line 96:**
```javascript
const templateID = 'YOUR_ACTUAL_TEMPLATE_ID_HERE';
```

## Step 6: Test
1. Save the file
2. Try registering with any Gmail address
3. Check Gmail inbox (and spam folder)
4. Enter the 6-digit OTP received

## Example Configuration:
```javascript
// Line 15
emailjs.init("user_kQJqKvqJGqHqKvqJG");

// Line 95-96
const serviceID = 'service_gamehub_otp';
const templateID = 'template_otp_verify';
```

## Free Tier:
- 200 emails per month
- No credit card required
- Perfect for testing

## Important Notes:
- OTP will be sent to the EXACT Gmail address user enters
- No popups or notifications with OTP
- Real email delivery only
- Check spam folder if not in inbox

Once configured, users will receive OTP ONLY in their Gmail account!