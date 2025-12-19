# Fix Stripe 401 Authentication Error

## Problem
You're getting: `Invalid API Key provided: sk_live_...` with status 401.

This means your Stripe live API key is either:
- Revoked or deleted
- Incorrect/incomplete
- From a different Stripe account

## Solution: Use Test Mode Keys

### Step 1: Get Test Keys from Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. **Toggle to TEST MODE** (switch in top right corner)
3. Go to **Developers** → **API keys**
4. Copy these two keys:
   - **Publishable key**: Starts with `pk_test_...`
   - **Secret key**: Starts with `sk_test_...` (click "Reveal test key")

### Step 2: Update Environment Variables in v0

1. In v0 chat, click the sidebar (left side)
2. Go to **Vars** section
3. Update these three variables:

```
STRIPE_SECRET_KEY=sk_test_YOUR_NEW_TEST_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_NEW_TEST_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_NEW_TEST_PUBLISHABLE_KEY
```

**Important:** Use the SAME test publishable key for both `STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 3: Test Your Payment

Use these test card numbers:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Test 3D Secure:**
- Card: `4000 0025 0000 3155`
- Complete the 3D Secure authentication popup

**Declined Payment:**
- Card: `4000 0000 0000 9995`

## When to Use Live Mode

Only switch to live mode when:
1. You're ready to accept real payments
2. You have a verified Stripe account
3. You've completed Stripe's onboarding
4. You're deploying to production

### Getting Live Keys

1. Complete Stripe account verification
2. Toggle to **LIVE MODE** in dashboard
3. Go to **Developers** → **API keys**
4. Copy live keys (start with `pk_live_...` and `sk_live_...`)
5. Update the same three environment variables with live keys

## Common Mistakes

- ❌ Mixing test and live keys (e.g., test secret + live publishable)
- ❌ Using revoked keys
- ❌ Not updating all three environment variables
- ❌ Forgetting the `NEXT_PUBLIC_` prefix on publishable key

## Need Help?

If you still get errors after updating keys:
1. Double-check you copied the FULL key (they're very long)
2. Ensure no extra spaces before/after the key
3. Verify you're in TEST mode in Stripe dashboard
4. Try creating a brand new test key
