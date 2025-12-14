"use client"

import { useState, useEffect, type FormEvent } from "react"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { AlertCircle, Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentElementCheckoutProps {
  amount: number
  recipientName: string
  recipientEmail: string
  senderName: string
  message: string
  uniqueCode: string
  onComplete: () => void
}

function CheckoutForm({
  amount,
  recipientName,
  senderName,
  onComplete,
}: {
  amount: number
  recipientName: string
  senderName: string
  onComplete: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSucceeded, setPaymentSucceeded] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (isProcessing || paymentSucceeded) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("[v0] Payment succeeded:", paymentIntent.id)
        setPaymentSucceeded(true)
        setIsProcessing(false)
        onComplete()
      } else {
        setError("Payment is still processing. Please check back shortly.")
        setIsProcessing(false)
      }
    } catch (err: any) {
      console.error("[v0] Payment error:", err)
      setError(err?.message || "An unexpected error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Payment Failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {paymentSucceeded && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <p className="text-sm text-green-800 font-medium">Payment successful! Creating your gift card...</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing || paymentSucceeded}
        className="w-full bg-gradient-to-r from-[#F6664C] to-[#FF8A6B] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : paymentSucceeded ? (
          "Payment Complete"
        ) : (
          `Pay £${amount.toFixed(2)}`
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        Payments are secured by Stripe. Your payment information is encrypted and secure.
      </p>
    </form>
  )
}

export default function PaymentElementCheckout({
  amount,
  recipientName,
  recipientEmail,
  senderName,
  message,
  uniqueCode,
  onComplete,
}: PaymentElementCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setError(null)
        const description = `Gift card from ${senderName} to ${recipientName}`

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            recipientName,
            senderName,
            description,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to initialize payment")
        }

        if (!data.clientSecret) {
          throw new Error("No client secret returned")
        }

        setClientSecret(data.clientSecret)
      } catch (err: any) {
        console.error("[v0] Error creating PaymentIntent:", err)
        setError(err?.message || "Failed to initialize payment")
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, recipientName, senderName])

  if (isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F6664C] mb-4" />
        <p className="text-sm text-gray-600">Initializing secure payment...</p>
      </div>
    )
  }

  if (error || !clientSecret) {
    return (
      <div className="w-full p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Payment Error</h3>
            <p className="text-red-700 mt-1 text-sm">{error || "Failed to initialize payment"}</p>
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

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#F6664C",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  return (
    <div className="w-full">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm amount={amount} recipientName={recipientName} senderName={senderName} onComplete={onComplete} />
      </Elements>
    </div>
  )
}
