"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { AlertCircle } from "lucide-react"

import { createCheckoutSession } from "@/app/actions/stripe"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (publishableKey) {
  console.log("[v0] Stripe publishable key prefix:", publishableKey.substring(0, 8))
}

const stripePromise = loadStripe(publishableKey!)

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

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null)
      const description = `Gift card from ${senderName} to ${recipientName}`
      const clientSecret = await createCheckoutSession(amount, description)

      if (!clientSecret) {
        throw new Error("No client secret returned")
      }

      return clientSecret
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to initialize checkout"
      setError(errorMessage)
      throw err
    }
  }, [amount, senderName, recipientName])

  if (error) {
    return (
      <div className="w-full p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Checkout Error</h3>
            <p className="text-red-700 mt-1 text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null)
                window.location.reload()
              }}
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
