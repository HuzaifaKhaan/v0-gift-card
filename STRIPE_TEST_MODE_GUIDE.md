# Switching Stripe from Live Mode to Test Mode

## Quick Overview

Stripe has two modes:
- **Live Mode**: Real payments with real credit cards (`sk_live_...`, `pk_live_...`)
- **Test Mode**: Testing with test cards (`sk_test_...`, `pk_test_...`)

## Step 1: Get Your Test Mode Keys

1. Go to https://dashboard.stripe.com
2. **Toggle to TEST MODE** in the top right corner (look for a "Test mode" switch)
3. Navigate to **Developers → API keys**
4. Copy your test keys:
   - **Secret key** (starts with `sk_test_...`)
   - **Publishable key** (starts with `pk_test_...`)

## Step 2: Get Your Test Webhook Secret

1. Still in TEST MODE on Stripe Dashboard
2. Go to **Developers → Webhooks**
3. Click on your webhook endpoint (or create one if it doesn't exist)
4. Click "Reveal" next to **Signing secret**
5. Copy the webhook secret (starts with `whsec_...`)

## Step 3: Update Environment Variables in v0

In your v0 chat:
1. Click the **sidebar** on the left
2. Go to **Vars** section
3. Update these variables with your TEST MODE keys:

```env
# Replace with TEST MODE keys (sk_test_... and pk_test_...)
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret_here
```

## Step 4: Test with Stripe Test Cards

Now you can test payments using these test card numbers:

### Successful Payments
- **Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

### 3D Secure Authentication Required
- **Card**: `4000 0025 0000 3155`
- This will trigger 3D Secure authentication flow

### Payment Declined
- **Card**: `4000 0000 0000 9995`
- This will simulate a declined payment

### More Test Cards
Find the complete list at: https://stripe.com/docs/testing

## Step 5: Verify You're in Test Mode

After updating the environment variables:

1. Make a test purchase in your app
2. Go to Stripe Dashboard → **Payments** (make sure TEST MODE is enabled)
3. You should see your test payment appear there

## Important Notes

- Test mode payments do NOT charge real money
- Test mode data is separate from live mode data
- You can switch between test and live mode anytime by updating the API keys
- NEVER commit API keys to your code - always use environment variables

## Switching Back to Live Mode

To go back to live mode later:
1. Get your LIVE MODE keys from Stripe Dashboard (toggle to Live Mode)
2. Update the same environment variables with live keys (`sk_live_...` and `pk_live_...`)
3. Test thoroughly in test mode before going live!

## Webhook Testing Locally

If you want to test webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe login`
3. Forward webhooks: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`
4. Copy the webhook secret from the CLI output
5. Update `STRIPE_WEBHOOK_SECRET` with that value

## Security Checklist

- ✅ Secret keys (`sk_`) are NEVER exposed to client-side code
- ✅ Publishable keys (`pk_`) are safe to use in client-side code
- ✅ Webhook secrets are stored securely in environment variables
- ✅ Always validate webhook signatures
- ✅ Test mode keys cannot charge real cards
- ✅ Live mode keys should only be used in production

## Current Setup Status

Your app is currently configured with these Stripe environment variables:
- `STRIPE_SECRET_KEY` - Used by server-side API routes
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Used by client-side components
- `STRIPE_WEBHOOK_SECRET` - Used to verify webhook signatures

All you need to do is replace their values with test mode keys!
