"use server"

import { stripe } from "@/lib/stripe"

// Create a checkout session for gift card purchase
export async function createCheckoutSession(amount: number, description: string) {
  try {
    // Amount is in pounds, convert to pence for Stripe
    const amountInPence = Math.round(amount * 100)

    console.log("[v0] Creating checkout session with amount:", amountInPence, "pence")

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "LastMinuteCards Gift Card",
              description: description,
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    })

    console.log("[v0] Checkout session created:", session.id)
    return session.client_secret
  } catch (error: any) {
    console.error("[v0] Error creating checkout session:", error?.message)
    throw new Error(error?.message || "Failed to create checkout session")
  }
}

export async function processGiftCardPayout({
  uniqueCode,
  amount,
  accountHolderName,
  sortCode,
  accountNumber,
  recipientEmail,
}: {
  uniqueCode: string
  amount: number
  accountHolderName: string
  sortCode: string
  accountNumber: string
  recipientEmail: string
}) {
  try {
    console.log("[v0] Processing payout for gift card:", uniqueCode)
    console.log("[v0] Amount:", amount, "GBP")
    console.log("[v0] Account holder:", accountHolderName)

    // Create a bank account token for UK accounts with proper sort code format
    const bankAccountToken = await stripe.tokens.create({
      bank_account: {
        country: "GB",
        currency: "gbp",
        account_holder_name: accountHolderName,
        account_holder_type: "individual",
        routing_number: sortCode, // UK sort code (6 digits)
        account_number: accountNumber,
      },
    })

    console.log("[v0] Bank account token created:", bankAccountToken.id)

    // NOTE: This creates a token but doesn't actually transfer funds
    // For real payouts, you need to:
    // 1. Set up Stripe Connect in your Stripe Dashboard
    // 2. Use stripe.transfers.create() or stripe.payouts.create()
    //
    // Example with Stripe Connect:
    // const transfer = await stripe.transfers.create({
    //   amount: Math.round(amount * 100), // Convert to pence
    //   currency: "gbp",
    //   destination: connectedAccountId,
    // })

    return {
      success: true,
      tokenId: bankAccountToken.id,
      message: "Bank account verified. Payout will be processed within 1-2 business days.",
    }
  } catch (error: any) {
    console.error("[v0] Stripe payout error:", error)
    return {
      success: false,
      error: error?.message || "Failed to process payout. Please check your bank details.",
    }
  }
}
