"use server"

import { stripe } from "@/lib/stripe"

// Create a checkout session for gift card purchase
export async function createCheckoutSession(amount: number, description: string) {
  try {
    // Amount is in pounds, convert to pence for Stripe
    const amountInPence = Math.round(amount * 100)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    console.log("[v0] Creating checkout session with amount:", amountInPence, "pence")
    console.log("[v0] Base URL:", baseUrl)

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      return_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
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
    console.error("[v0] Error creating checkout session:", error)
    console.error("[v0] Error details:", JSON.stringify(error, null, 2))
    throw new Error(error?.message || "Failed to create checkout session")
  }
}

// Process payout to recipient's bank account
export async function processGiftCardPayout({
  uniqueCode,
  amount,
  accountHolderName,
  routingNumber,
  accountNumber,
  accountType,
  recipientEmail,
}: {
  uniqueCode: string
  amount: number
  accountHolderName: string
  routingNumber: string
  accountNumber: string
  accountType: "checking" | "savings"
  recipientEmail: string
}) {
  try {
    // Create a Stripe Connect Express account for the recipient
    const account = await stripe.accounts.create({
      type: "custom",
      country: "GB",
      email: recipientEmail,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: "individual",
      individual: {
        first_name: accountHolderName.split(" ")[0] || accountHolderName,
        last_name: accountHolderName.split(" ").slice(1).join(" ") || "User",
        email: recipientEmail,
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: "127.0.0.1",
      },
    })

    // Add bank account to the Connect account
    await stripe.accounts.createExternalAccount(account.id, {
      external_account: {
        object: "bank_account",
        country: "GB",
        currency: "gbp",
        account_holder_name: accountHolderName,
        account_holder_type: "individual",
        routing_number: routingNumber,
        account_number: accountNumber,
      },
    })

    // Transfer funds to the Connect account
    const amountInPence = Math.round(amount * 100)
    const transfer = await stripe.transfers.create({
      amount: amountInPence,
      currency: "gbp",
      destination: account.id,
      description: `Gift card payout - ${uniqueCode}`,
    })

    return {
      success: true,
      transferId: transfer.id,
      accountId: account.id,
    }
  } catch (error: any) {
    console.error("[v0] Stripe payout error:", error)
    return {
      success: false,
      error: error?.message || "Failed to process payout",
    }
  }
}
