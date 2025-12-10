import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("[v0] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("[v0] Payment successful for session:", session.id)

      // You can add additional processing here if needed
      // For example, updating the gift card status or sending confirmation emails

      break
    }
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session
      console.log("[v0] Async payment succeeded for session:", session.id)
      break
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session
      console.log("[v0] Async payment failed for session:", session.id)
      break
    }
    default:
      console.log(`[v0] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
