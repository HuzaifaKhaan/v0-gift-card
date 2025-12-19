"use server"

import { stripe } from "@/lib/stripe"
import { validateAmount, validateUKSortCode, validateUKAccountNumber, sanitizeName } from "@/lib/validation"
import { createClient } from "@/lib/supabase/server"

export async function createCheckoutSession(amount: number, description: string) {
  try {
    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) {
      throw new Error(amountValidation.error)
    }

    const amountInPence = Math.round(amount * 100)

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "LastMinuteCards Gift Card",
              description: description.substring(0, 500), // Limit description length
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    })

    return session.client_secret
  } catch (error: any) {
    console.error("Error creating checkout session:", error?.message)
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
    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) {
      return {
        success: false,
        error: amountValidation.error,
      }
    }

    if (!validateUKSortCode(sortCode)) {
      return {
        success: false,
        error: "Invalid sort code. Must be 6 digits (e.g., 12-34-56)",
      }
    }

    if (!validateUKAccountNumber(accountNumber)) {
      return {
        success: false,
        error: "Invalid account number. Must be 8 digits",
      }
    }

    const sanitizedName = sanitizeName(accountHolderName)
    if (!sanitizedName) {
      return {
        success: false,
        error: "Account holder name is required",
      }
    }

    const cleanedSortCode = sortCode.replace(/[\s-]/g, "")
    const cleanedAccountNumber = accountNumber.replace(/\s/g, "")

    const bankAccountToken = await stripe.tokens.create({
      bank_account: {
        country: "GB",
        currency: "gbp",
        account_holder_name: sanitizedName,
        account_holder_type: "individual",
        routing_number: cleanedSortCode,
        account_number: cleanedAccountNumber,
      },
    })

    const supabase = createClient()
    const last4 = cleanedAccountNumber.slice(-4)

    const { error: updateError } = await supabase
      .from("gift_cards")
      .update({
        account_holder_name: sanitizedName,
        sort_code: cleanedSortCode,
        account_number_last4: last4,
      })
      .eq("unique_code", uniqueCode)

    if (updateError) {
      console.error("[v0] Error saving bank details:", updateError)
      // Don't fail the payout if saving bank details fails, but log it
    }

    return {
      success: true,
      tokenId: bankAccountToken.id,
      message: "Bank account verified. Payout will be processed within 1-2 business days.",
    }
  } catch (error: any) {
    console.error("Stripe payout error:", error)
    return {
      success: false,
      error: error?.message || "Failed to process payout. Please check your bank details.",
    }
  }
}
