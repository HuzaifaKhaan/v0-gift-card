"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"
import { AlertCircle } from "lucide-react"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Debug: Log the key prefix (first 10 chars only for security)
if (typeof window !== "undefined") {
  console.log("[v0] Stripe publishable key prefix:", publishableKey?.substring(0, 12) + "...")
  console.log(
    "[v0] Key starts with pk_test_ or pk_live_:",
    publishableKey?.startsWith("pk_test_") || publishableKey?.startsWith("pk_live_"),
  )
}

const stripePromise =
  publishableKey?.startsWith("pk_test_") || publishableKey?.startsWith("pk_live_") ? loadStripe(publishableKey) : null

interface StripeCheckoutProps {
  amount: number
  recipientName: string
  recipientEmail: string
  senderName: string
  message: string
  uniqueCode: string
  onComplete: () => void
}

export default function StripeCheckout({ amount, recipientName, senderName, onComplete }: StripeCheckoutProps) {
  const [keyError, setKeyError] = useState(false)

  useEffect(() => {
    if (!stripePromise) {
      setKeyError(true)
      console.error("[v0] Invalid Stripe key format. Key must start with 'pk_test_' or 'pk_live_'")
      console.error("[v0] Current key prefix:", publishableKey?.substring(0, 12))
    }
  }, [])

  const fetchClientSecret = useCallback(async () => {
    const description = `Gift card from ${senderName} to ${recipientName}`
    const clientSecret = await createCheckoutSession(amount, description)
    return clientSecret!
  }, [amount, senderName, recipientName])

  if (keyError || !stripePromise) {
    return (
      <div className="w-full p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Stripe Configuration Error</h3>
            <p className="text-red-700 mt-1 text-sm">
              The Stripe publishable key is using an outdated format. Please update your Stripe API keys.
            </p>
            <p className="text-red-600 mt-2 text-xs">Current key prefix: {publishableKey?.substring(0, 12)}...</p>
            <div className="mt-3 text-sm text-red-700">
              <p className="font-medium">To fix this:</p>
              <ol className="list-decimal ml-4 mt-1 space-y-1">
                <li>
                  Go to your{" "}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Stripe Dashboard API Keys
                  </a>
                </li>
                <li>Roll (regenerate) your publishable key</li>
                <li>Update the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your v0 Vars</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
