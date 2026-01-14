# Fix Email Delivery Issues - Quick Guide

## Problem
Emails are not reaching recipient inboxes.

## Root Causes
1. **Resend domain not verified** - Most common issue
2. **Missing DNS authentication records** - SPF, DKIM, DMARC
3. **Using default Resend domain instead of custom domain**

## Immediate Fix (5 minutes)

### Option 1: Use Resend's Default Domain (Quick Test)
If you just want to test email functionality immediately:

1. Go to your v0 sidebar → **Vars** section
2. Update `RESEND_FROM_EMAIL` to:
   ```
   LastMinuteCards <onboarding@resend.dev>
   ```
3. This uses Resend's verified domain and will deliver immediately
4. ⚠️ Only for testing - not for production use

### Option 2: Verify Your Custom Domain (Production Ready)

1. **Log into Resend Dashboard**
   - Go to https://resend.com/domains
   - Click "Add Domain"
   - Enter: `lastminutecards.com`

2. **Add DNS Records** (in your domain provider)
   - Resend will show you exactly which DNS records to add
   - Add all SPF, DKIM, and DMARC records
   - Wait 10-30 minutes for DNS propagation

3. **Update Environment Variable**
   - In v0 sidebar → **Vars**
   - Set `RESEND_FROM_EMAIL` to:
     ```
     LastMinuteCards <hello@lastminutecards.com>
     ```

4. **Verify It Works**
   - Resend dashboard will show "Verified" status
   - Send a test gift card email
   - Check recipient's inbox (not spam)

## Check Current Status

### Verify Environment Variables are Set
In v0 sidebar → **Vars**, confirm you have:
- ✅ `RESEND_API_KEY` - Your Resend API key
- ✅ `RESEND_FROM_EMAIL` - Sender email address
- ✅ `NEXT_PUBLIC_APP_URL` - Your app URL

### Test Email Sending
1. Create a test gift card
2. Check the v0 console logs for:
   ```
   [v0] Email sent successfully via Resend
   [v0] Email ID: [some-id]
   ```
3. If you see errors, check the error message

## Common Error Messages

### "API key not configured"
- Add `RESEND_API_KEY` to v0 Vars
- Get it from https://resend.com/api-keys

### "Domain not verified"
- Complete domain verification in Resend dashboard
- Or use `onboarding@resend.dev` for testing

### "Invalid from address"
- FROM address must match verified domain
- Can't use `noreply@` or random domains
- Use format: `Name <email@verifieddomain.com>`

## Testing Checklist

After fixing:
- [ ] Send test gift card to your own email
- [ ] Check it arrives in inbox (not spam)
- [ ] Verify all links work
- [ ] Check email renders correctly on mobile
- [ ] Test with different email providers (Gmail, Outlook, etc.)

## Need More Help?

See full setup guide: `RESEND_SETUP.md`

Or check:
- Resend Dashboard: https://resend.com/emails (shows delivery status)
- Resend Logs: https://resend.com/logs (shows all API calls)
- Resend Docs: https://resend.com/docs
