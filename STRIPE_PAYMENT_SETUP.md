# Stripe Payment Element Setup Guide

This document explains the Stripe PaymentIntent implementation with proper 3D Secure authentication support.

## Architecture Overview

### 1. Server-Side: `/app/api/create-payment-intent/route.ts`
- Creates PaymentIntent on the server (secure)
- Validates amount and prevents tampering
- Enables automatic payment methods for better compatibility
- Configures 3D Secure authentication (`request_three_d_secure: "automatic"`)
- Returns only the `client_secret` to the frontend

### 2. Client-Side: `components/payment-element-checkout.tsx`
- Fetches `client_secret` from API route
- Renders Stripe Payment Element UI
- Handles payment confirmation with `stripe.confirmPayment()`
- Includes `return_url` for 3D Secure redirects
- Prevents duplicate submissions
- Shows loading and error states

## Environment Variables

Required environment variables (already configured in your project):

\`\`\`
STRIPE_SECRET_KEY=sk_test_...           # Server-side only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Client-side
\`\`\`

## Key Features

### 3D Secure (SCA) Support
- Automatically requests 3D Secure when required by regulation
- Handles authentication redirects with `return_url`
- Uses `redirect: "if_required"` to avoid unnecessary redirects

### Payment Flow
1. Component mounts → calls `/api/create-payment-intent`
2. Server creates PaymentIntent → returns `client_secret`
3. Payment Element renders with payment methods
4. User enters card details
5. User clicks "Pay" → `stripe.confirmPayment()` called
6. If 3D Secure required → user redirected to bank
7. After authentication → user returned via `return_url`
8. Payment succeeds → `onComplete()` callback fired

### Error Handling
- Network errors
- Invalid card details
- Insufficient funds
- Authentication failures
- Duplicate submissions prevented

### Security Features
- Amount validated server-side
- PaymentIntent created on server (not client)
- No price manipulation possible
- Metadata stored for tracking
- Automatic 3D Secure compliance

## Usage

Replace your current `StripeCheckout` component:

\`\`\`tsx
// Old (Embedded Checkout)
<StripeCheckout
  amount={totalAmount}
  recipientName={cardData.recipientName}
  onComplete={handlePaymentComplete}
/>

// New (Payment Element)
<PaymentElementCheckout
  amount={totalAmount}
  recipientName={cardData.recipientName}
  recipientEmail={cardData.email || ""}
  senderName={cardData.senderName || "Anonymous"}
  message={cardData.message || ""}
  uniqueCode={uniqueCode}
  onComplete={handlePaymentComplete}
/>
\`\`\`

## Testing 3D Secure

Use these test cards in test mode:

### Always authenticate (3D Secure required)
- Card: `4000 0027 6000 3184`
- Any future expiry, any CVC, any postal code

### Authentication optional
- Card: `4242 4242 4242 4242`
- Any future expiry, any CVC, any postal code

### Authentication fails
- Card: `4000 0000 0000 9995`
- Any future expiry, any CVC, any postal code

## Webhook Support (Optional)

For production, you should also handle webhooks:

\`\`\`typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object
    // Handle successful payment
    console.log("Payment succeeded:", paymentIntent.id)
  }
  
  return NextResponse.json({ received: true })
}
\`\`\`

## Common Issues

### "We are unable to authenticate your payment method"
- Ensure `return_url` is set in `confirmPayment()`
- Check that `automatic_payment_methods` is enabled
- Verify `request_three_d_secure: "automatic"` is configured

### Payment confirmed but onComplete not called
- Check `paymentIntent.status === "succeeded"` condition
- Verify no JavaScript errors in console
- Ensure `redirect: "if_required"` is set

### Duplicate payments
- Use `isProcessing` and `paymentSucceeded` state to prevent re-submission
- Only call `confirmPayment()` once per PaymentIntent

## Currency Configuration

Current setting: **GBP** (British Pounds)

To change currency, edit `app/api/create-payment-intent/route.ts`:

\`\`\`typescript
currency: "usd", // or "eur", "gbp", "aud", etc.
\`\`\`

And update the button text in `components/payment-element-checkout.tsx`:

\`\`\`tsx
`Pay $${amount.toFixed(2)}` // for USD
`Pay €${amount.toFixed(2)}` // for EUR
