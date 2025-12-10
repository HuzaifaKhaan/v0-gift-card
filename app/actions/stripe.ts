"use server"

import { stripe } from "@/lib/stripe"

export async function createCheckoutSession(amount: number, description: string, uniqueCode?: string) {
  try {
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
      metadata: {
        unique_code: uniqueCode || "",
        product_type: "gift_card",
      },
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
  sortCode: string // UK sort code (6 digits)
  accountNumber: string // UK account number (8 digits)
  recipientEmail: string
}) {
  try {
    console.log("[v0] Creating payout for gift card:", uniqueCode)

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
        ip: "127.0.0.1", // In production, you should capture the real IP
      },
    })

    console.log("[v0] Created Stripe account:", account.id)

    // Add UK bank account to the Connect account
    // Format: sort code (6 digits) + account number (8 digits) = 14 digits total
    const bankAccount = await stripe.accounts.createExternalAccount(account.id, {
      external_account: {
        object: "bank_account",
        country: "GB",
        currency: "gbp",
        account_holder_name: accountHolderName,
        account_holder_type: "individual",
        // For UK: routing_number is the sort code
        routing_number: sortCode.replace(/-/g, ""), // Remove dashes if present
        account_number: accountNumber,
      },
    })

    console.log("[v0] Added bank account:", bankAccount.id)

    // Transfer funds to the Connect account
    const amountInPence = Math.round(amount * 100)
    const transfer = await stripe.transfers.create({
      amount: amountInPence,
      currency: "gbp",
      destination: account.id,
      description: `Gift card payout - ${uniqueCode}`,
      metadata: {
        unique_code: uniqueCode,
        payout_type: "gift_card_claim",
      },
    })

    console.log("[v0] Transfer created:", transfer.id)

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

export async function getPaymentDetails(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      success: true,
      amount: paymentIntent.amount / 100, // Convert pence to pounds
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: new Date(paymentIntent.created * 1000),
    }
  } catch (error: any) {
    console.error("[v0] Error retrieving payment:", error)
    return {
      success: false,
      error: error?.message || "Failed to retrieve payment details",
    }
  }
}
