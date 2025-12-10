"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"
import { AlertCircle } from "lucide-react"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

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
    }
  }, [])

  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const description = `Gift card from ${senderName} to ${recipientName}`
      console.log("[v0] Fetching client secret for amount:", amount)
      const clientSecret = await createCheckoutSession(amount, description)
      console.log("[v0] Client secret received:", clientSecret ? "yes" : "no")

      if (!clientSecret) {
        throw new Error("No client secret returned from server")
      }

      setLoading(false)
      return clientSecret
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
