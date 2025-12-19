# Resend Email Deliverability Guide

## Current Issues Identified

1. **Missing DNS Authentication**: SPF, DKIM, DMARC records not configured
2. **Generic FROM address**: Using `process.env.RESEND_FROM_EMAIL` without proper domain setup
3. **No reply-to address**: Missing reply-to for better engagement
4. **Email content needs optimization**: HTML structure could trigger spam filters

## Required DNS Configuration

### Step 1: Verify Your Domain in Resend

1. Log in to your Resend dashboard: https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain: `lastminutecards.com` (or your actual domain)
4. Follow the verification process

### Step 2: Add Required DNS Records

Add these records to your domain's DNS settings (e.g., Vercel Domains, Cloudflare, etc.):

#### SPF Record (Sender Policy Framework)

```txt
Type: TXT
Name: @ (or your subdomain)
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### DKIM Records (DomainKeys Identified Mail)

Resend will provide these after domain verification. They look like:

```txt
Type: TXT
Name: resend._domainkey
Value: [Provided by Resend - long string]
TTL: 3600
```

#### DMARC Record (Domain-based Message Authentication)

```txt
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@lastminutecards.com; ruf=mailto:dmarc@lastminutecards.com; fo=1; adkim=s; aspf=s
TTL: 3600
```

### Step 3: Verify DNS Propagation

After adding DNS records, wait 24-48 hours for full propagation. Check status:
- Use https://mxtoolbox.com/dmarc.aspx to verify DMARC
- Use https://mxtoolbox.com/spf.aspx to verify SPF
- Check Resend dashboard for DKIM verification status

## Environment Variables Setup

Make sure these are set in your Vercel project:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=LastMinuteCards <hello@lastminutecards.com>
NEXT_PUBLIC_APP_URL=https://lastminutecards.vercel.app
```

**Important**: The `RESEND_FROM_EMAIL` must use your verified domain!

## Best Practices for Deliverability

### 1. Use Proper FROM Address
- Use: `LastMinuteCards <hello@lastminutecards.com>`
- Don't use: `noreply@domain.com` (triggers spam filters)
- Include a real name before the email

### 2. Add Reply-To Address

```javascript
{
  from: "LastMinuteCards <hello@lastminutecards.com>",
  replyTo: "support@lastminutecards.com",
  to: recipientEmail,
}
```

### 3. Email Content Best Practices
- Use plain text alternative alongside HTML
- Avoid spam trigger words: "FREE", "URGENT", "ACT NOW"
- Keep HTML simple and mobile-friendly
- Include an unsubscribe link (required for marketing emails)
- Use descriptive subject lines without excessive punctuation

### 4. Warm Up Your Domain
- Start by sending to engaged users
- Gradually increase volume over 2-4 weeks
- Monitor bounce and complaint rates

### 5. List Hygiene
- Remove bounced emails
- Honor unsubscribe requests immediately
- Verify email addresses before sending

## Monitoring & Troubleshooting

### Check Deliverability in Resend Dashboard
1. Go to https://resend.com/emails
2. Monitor delivery status, opens, clicks
3. Check for bounces and complaints

### Common Issues

**Emails going to spam:**
- Verify all DNS records are correct
- Check domain reputation at https://senderscore.org
- Review email content for spam triggers
- Ensure proper authentication (SPF, DKIM, DMARC passing)

**Emails not sending:**
- Verify API key is correct
- Check domain verification status
- Ensure FROM address uses verified domain
- Review Resend dashboard for error messages

**Low engagement:**
- Improve subject lines
- Add personalization
- Send at optimal times
- Segment your audience

## Testing Your Setup

1. Send a test email to yourself
2. Check email headers (View Original in Gmail)
3. Verify SPF, DKIM, DMARC all show "PASS"
4. Use https://www.mail-tester.com to score your email

## Additional Resources

- Resend Documentation: https://resend.com/docs
- Email Authentication Guide: https://resend.com/docs/dashboard/domains/authentication
- Deliverability Best Practices: https://resend.com/docs/knowledge-base/deliverability-best-practices
