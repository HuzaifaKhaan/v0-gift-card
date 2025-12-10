import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe directly in API route for better error handling
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe key exists
    if (!stripeSecretKey) {
      console.error("[v0] STRIPE_SECRET_KEY is not configured")
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 })
    }

    // Validate key format
    if (!stripeSecretKey.startsWith("sk_test_") && !stripeSecretKey.startsWith("sk_live_")) {
      console.error("[v0] Invalid STRIPE_SECRET_KEY format - must start with sk_test_ or sk_live_")
      return NextResponse.json({ error: "Payment system configuration error" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey)

    const body = await request.json()
    const { amount, description } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Amount is in pounds, convert to pence for Stripe
    const amountInPence = Math.round(amount * 100)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000"

    console.log("[v0] Creating checkout session:", { amountInPence, baseUrl })

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      return_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "LastMinuteCards Gift Card",
              description: description || "Gift Card Purchase",
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    })

    console.log("[v0] Checkout session created successfully:", session.id)

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error: any) {
    console.error("[v0] Stripe error:", error?.message || error)
    console.error("[v0] Full error:", JSON.stringify(error, null, 2))

    return NextResponse.json({ error: error?.message || "Failed to create checkout session" }, { status: 500 })
  }
}
