# EmailJS Setup Guide for Real Gmail OTP

To send OTP to real Gmail accounts, follow these steps to set up EmailJS:

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail" as your email service
4. Connect your Gmail account (the one that will send OTP emails)
5. Note down your **Service ID**

## Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:** Your OTP for GameHub Registration

**Content:**
```
Hello {{to_name}},

Welcome to GameHub! 

Your OTP for registration is: {{otp_code}}

This OTP is valid for {{validity}}.

Please do not share this code with anyone.

Best regards,
{{from_name}}
```

4. Save the template and note down your **Template ID**

## Step 4: Get Public Key
1. Go to "Account" > "General"
2. Copy your **Public Key**

## Step 5: Update Code
Replace these values in script.js:

```javascript
// Line 15: Replace with your Public Key
emailjs.init("YOUR_PUBLIC_KEY_HERE");

// Line 95: Replace with your Service ID
const serviceID = 'YOUR_SERVICE_ID_HERE';

// Line 96: Replace with your Template ID  
const templateID = 'YOUR_TEMPLATE_ID_HERE';
```

## Step 6: Template Variables
Make sure your EmailJS template uses these variables:
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{otp_code}}` - The 6-digit OTP
- `{{from_name}}` - Sender name (GameHub Support)
- `{{validity}}` - OTP validity (10 minutes)

## Step 7: Test
1. Save all changes
2. Open your website
3. Try registering with a real Gmail address
4. Check your Gmail inbox (and spam folder)

## Free Tier Limits
- 200 emails per month
- Rate limit: 1 email per 5 seconds

## Security Notes
- Keep your keys secure
- Don't commit them to public repositories
- Consider using environment variables for production

## Troubleshooting
- Check spam folder if email doesn't arrive
- Verify all IDs are correct
- Check EmailJS dashboard for error logs
- Ensure Gmail account is properly connected

Once configured, users will receive real OTP emails in their Gmail accounts!