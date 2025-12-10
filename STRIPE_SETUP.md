# Stripe Integration Setup Guide

## Current Status
✅ Stripe credentials connected  
✅ Embedded Checkout implemented  
✅ Payment flow functional  
✅ Database tracking setup  
⚠️ Webhook configuration needed  

## Setup Steps

### 1. Configure Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL:
   - **Development**: `https://your-preview-url.vercel.app/api/webhooks/stripe`
   - **Production**: `https://your-domain.com/api/webhooks/stripe`

4. Select events to listen to:
   - `checkout.session.completed` (required)
   - `payment_intent.succeeded` (recommended)
   - `payment_intent.payment_failed` (recommended)

5. Copy the **Signing secret** (starts with `whsec_`)

### 2. Add Webhook Secret to Environment Variables

Add this to your Vercel project environment variables:

\`\`\`
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
\`\`\`

Or add it via v0 interface:
- Click **Vars** in the left sidebar
- Add new variable: `STRIPE_WEBHOOK_SECRET`
- Paste the signing secret from Stripe Dashboard

### 3. Test the Webhook

1. In Stripe Dashboard → Webhooks → Your endpoint
2. Click "Send test webhook"
3. Select `checkout.session.completed`
4. Check your application logs to verify it was received

### 4. Bank Payout Configuration (Optional)

If you want to support claiming gift cards to bank accounts:

1. **For UK Bank Accounts** (current setup):
   - Users need: Sort code (6 digits) + Account number (8 digits)
   - Stripe Connect Express account is auto-created
   - Transfers happen instantly

2. **Requirements**:
   - Stripe Connect must be enabled on your account
   - You may need to complete additional verification
   - Platform fee configuration (optional)

## Payment Flow

### Current Implementation

1. **User customizes card** → Session storage
2. **Checkout page** → Creates Stripe session with embedded UI
3. **Payment succeeds** → `onComplete` callback fires
4. **Gift card created** → Saved to Supabase database
5. **Email sent** → Via Resend to recipient
6. **Webhook received** → Updates payment_intent_id in database

### Database Schema

The `gift_cards` table tracks:
- `stripe_payment_intent_id` - Links to Stripe payment
- `stripe_payout_id` - Links to payout transfer (if claimed to bank)
- `payout_status` - Tracks payout state
- `status` - Overall gift card status (Sent, Opened, Claimed, Failed)

## Testing

### Test Cards (Stripe Test Mode)

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC will work.

### Webhook Testing

Use Stripe CLI for local testing:

\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
\`\`\`

## Security Notes

- ✅ Webhook signature verification implemented
- ✅ Server-side Stripe API calls only
- ✅ No sensitive keys exposed to client
- ✅ Amount validation on server
- ⚠️ Consider adding rate limiting to webhook endpoint
- ⚠️ Consider idempotency keys for payout operations

## Monitoring

Check these in Stripe Dashboard:

1. **Payments** - View all successful/failed payments
2. **Webhooks** - Monitor webhook delivery and failures
3. **Connect** - Track payout transfers (if using bank claims)
4. **Logs** - Debug API requests

## Support

If you encounter issues:

1. Check Stripe Dashboard → Logs for API errors
2. Check Vercel logs for webhook delivery issues
3. Verify environment variables are set correctly
4. Test with Stripe test mode first

## Next Steps

After webhook setup:

1. Test end-to-end flow in test mode
2. Verify webhook receives events
3. Check database updates correctly
4. Test email delivery
5. Switch to live mode when ready
