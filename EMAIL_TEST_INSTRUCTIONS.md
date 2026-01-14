# Email Testing Instructions

Your email system is now configured and ready to test!

## Environment Variables Confirmed ✓
- `RESEND_API_KEY` - Configured
- `RESEND_FROM_EMAIL` - Configured
- Domain verified and ready

## How to Test Email Delivery

### 1. Test from the Application
1. Go to your test receiver page: `/test-receiver`
2. Fill in the form with:
   - Sender name: Your Name
   - Sender email: your-email@example.com
   - Recipient name: Test Recipient
   - **Recipient email: YOUR ACTUAL EMAIL ADDRESS**
   - Amount: 50
   - Message: Test message
3. Click "Create Test Gift Card"
4. Check your inbox for the gift card email

### 2. Check Email Delivery
- **Inbox**: Email should arrive within 1-2 minutes
- **Spam folder**: If not in inbox, check spam/junk folder
- **Email client**: Works with Gmail, Outlook, Apple Mail, etc.

### 3. What You'll Receive
A professional email with:
- 🎁 Gift card notification
- £50 amount displayed
- "Claim Your Cash Gift" button
- Personal message
- Unique redemption code
- Professional branding with your domain

### 4. Verify Email Features
✓ Opens correctly in email client
✓ Button/link works and redirects to claim page
✓ Images and styling display properly
✓ Mobile responsive (check on phone)
✓ Plain text version works (for basic email clients)

## Troubleshooting

### Email Not Arriving?
1. **Check spam folder** - First-time emails often go to spam
2. **Verify domain** - Ensure DNS records are set up in Resend dashboard
3. **Check Resend logs** - Go to Resend dashboard > Logs to see delivery status
4. **Console logs** - Check browser console for "[v0] Email sent successfully"

### Email in Spam?
This is normal for the first few emails. To improve deliverability:
1. Mark email as "Not Spam" in your email client
2. Add sender to contacts
3. After a few successful deliveries, future emails will go to inbox
4. Ensure SPF, DKIM, and DMARC records are configured in Resend

### Email Fails to Send?
Check browser console for error messages:
- `RESEND_API_KEY not configured` - Add API key to environment variables
- `401 Unauthorized` - API key is invalid, get new one from Resend
- `Domain not verified` - Complete domain verification in Resend dashboard

## Monitor Email Status

### In Resend Dashboard
1. Go to https://resend.com/emails
2. View all sent emails
3. Check delivery status
4. See open rates and click rates

### In Your App
Check console logs for:
```
[v0] Sending gift card email to: recipient@example.com
[v0] Email sent successfully via Resend
[v0] Email ID: re_xxxxxxxxxxxxx
```

## Production Checklist
Before going live:
- [ ] Domain verified in Resend
- [ ] DNS records (SPF, DKIM, DMARC) configured
- [ ] Test emails delivered to inbox (not spam)
- [ ] Mobile email display looks good
- [ ] All email links work correctly
- [ ] "From" address uses your domain
- [ ] Reply-to address configured

Your email system is production-ready! 🚀
