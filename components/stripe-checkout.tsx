"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { AlertCircle } from "lucide-react"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (publishableKey) {
  console.log("[v0] Stripe publishable key prefix:", publishableKey.substring(0, 8))
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null

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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publishableKey) {
      setError("Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.")
      setLoading(false)
    } else if (!publishableKey.startsWith("pk_test_") && !publishableKey.startsWith("pk_live_")) {
      setError("Invalid Stripe publishable key format. Key must start with 'pk_test_' or 'pk_live_'.")
      setLoading(false)
    }
  }, [])

  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const description = `Gift card from ${senderName} to ${recipientName}`
      console.log("[v0] Fetching client secret for amount:", amount)

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] API error:", data.error)
        throw new Error(data.error || "Failed to create checkout session")
      }

      console.log("[v0] Client secret received:", data.clientSecret ? "yes" : "no")

      if (!data.clientSecret) {
        throw new Error("No client secret returned from server")
      }

      setLoading(false)
      return data.clientSecret
    } catch (err: any) {
      console.error("[v0] Error fetching client secret:", err)
      setError(err?.message || "Failed to initialize checkout. Please try again.")
      setLoading(false)
      throw err
    }
  }, [amount, senderName, recipientName])

  if (!publishableKey || !stripePromise) {
    return (
      <div className="w-full p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Stripe Configuration Error</h3>
            <p className="text-red-700 mt-1 text-sm">
              Stripe publishable key is not configured. Please add it to your environment variables.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Checkout Error</h3>
            <p className="text-red-700 mt-1 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
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
