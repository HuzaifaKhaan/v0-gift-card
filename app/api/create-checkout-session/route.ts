import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description } = body

    if (!amount || amount <= 0) {
      console.error("[v0] Invalid amount:", amount)
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
    console.error("[v0] Error creating checkout session:", error?.message || error)

    if (error?.type === "StripeAuthenticationError") {
      return NextResponse.json(
        {
          error:
            "Stripe API key is invalid or has been revoked. Please update your STRIPE_SECRET_KEY in environment variables.",
          details: "Go to v0 sidebar → Vars → Update STRIPE_SECRET_KEY with a valid test key (sk_test_...)",
        },
        { status: 500 },
      )
    }

    if (error?.statusCode === 401) {
      return NextResponse.json(
        {
          error: "Invalid Stripe API credentials. Please check your STRIPE_SECRET_KEY.",
          details:
            "The API key may be revoked or incorrect. Get a new key from Stripe Dashboard → Developers → API keys",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({ error: error?.message || "Failed to create checkout session" }, { status: 500 })
  }
}
