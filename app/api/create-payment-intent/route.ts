import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, recipientName, senderName, description } = body

    // Validate required fields
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Convert amount to cents (Stripe requires smallest currency unit)
    const amountInCents = Math.round(amount * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "gbp", // Change to your currency (usd, eur, etc.)
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        recipientName: recipientName || "Unknown",
        senderName: senderName || "Anonymous",
        description: description || "Gift card purchase",
      },
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error("[v0] Error creating PaymentIntent:", error)
    return NextResponse.json({ error: error?.message || "Failed to create payment intent" }, { status: 500 })
  }
}
