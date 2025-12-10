import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Create Supabase client with service role for server-side operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("[v0] No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    if (!webhookSecret) {
      console.error("[v0] STRIPE_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("[v0] Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    console.log("[v0] Stripe webhook received:", event.type)

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("[v0] Checkout session completed:", session.id)
      console.log("[v0] Payment intent:", session.payment_intent)
      console.log("[v0] Customer email:", session.customer_details?.email)
      console.log("[v0] Amount total:", session.amount_total)

      // Extract metadata if you added any
      const metadata = session.metadata || {}

      // Update gift card with payment intent ID
      if (session.payment_intent) {
        // Find the gift card by sender email or other identifier
        // Note: You should pass uniqueCode in session metadata for more reliable lookup
        const { data: giftCard, error: lookupError } = await supabase
          .from("gift_cards")
          .select("*")
          .eq("sender_email", session.customer_details?.email || "")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (lookupError) {
          console.error("[v0] Error finding gift card:", lookupError)
        } else if (giftCard) {
          console.log("[v0] Found gift card:", giftCard.id)

          // Update with payment information
          const { error: updateError } = await supabase
            .from("gift_cards")
            .update({
              stripe_payment_intent_id: session.payment_intent as string,
              status: "Sent",
            })
            .eq("id", giftCard.id)

          if (updateError) {
            console.error("[v0] Error updating gift card:", updateError)
          } else {
            console.log("[v0] Gift card updated with payment intent")
          }
        }
      }
    }

    // Handle payment_intent.succeeded for additional tracking
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("[v0] Payment intent succeeded:", paymentIntent.id)
    }

    // Handle payment failures
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error("[v0] Payment failed:", paymentIntent.id)

      // You could update gift card status to "Failed" here
      const { error } = await supabase
        .from("gift_cards")
        .update({ status: "Failed" })
        .eq("stripe_payment_intent_id", paymentIntent.id)

      if (error) {
        console.error("[v0] Error updating failed payment:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: error?.message || "Webhook handler failed" }, { status: 500 })
  }
}
