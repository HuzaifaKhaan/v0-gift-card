"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Gift, ArrowRight, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { decodeGiftCode, getGiftCardByCode, updateGiftCardStatus } from "@/app/actions/gift-cards"

function RewardPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [giftCard, setGiftCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyAndLoadGiftCard = async () => {
      try {
        const encodedCode = searchParams.get("token")

        if (!encodedCode) {
          setError("Invalid reward link. Please check your link and try again.")
          setLoading(false)
          setVerifying(false)
          return
        }

        const uniqueCode = await decodeGiftCode(encodedCode)

        // Fetch gift card by unique code
        const result = await getGiftCardByCode(uniqueCode)

        if (result.error || !result.data) {
          setError("Gift card not found. Please check your link and try again.")
          setLoading(false)
          setVerifying(false)
          return
        }

        // Check if already claimed
        if (result.data.status === "Claimed") {
          setError("This gift card has already been claimed.")
          setLoading(false)
          setVerifying(false)
          return
        }

        setGiftCard(result.data)
        setVerifying(false)
        setLoading(false)

        // Update status to Opened if not already
        if (result.data.status === "Sent") {
          await updateGiftCardStatus(uniqueCode, "Opened")
        }
      } catch (err: any) {
        console.error("[v0] Error loading gift card:", err)
        setError("Failed to load gift card. Please try again.")
        setLoading(false)
        setVerifying(false)
      }
    }

    verifyAndLoadGiftCard()
  }, [searchParams])

  const handleClaimReward = () => {
    if (giftCard) {
      // Navigate to bank account form with gift card data
      router.push(`/claim?token=${searchParams.get("token")}`)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-[#FEF9F5] to-[#F0F9FF] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F6664C] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Verifying your reward link...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-[#FEF9F5] to-[#F0F9FF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Reward</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/")} className="bg-[#F6664C] hover:bg-[#e55a42] text-white">
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  if (!giftCard) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-[#FEF9F5] to-[#F0F9FF] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Reward Verified!</h1>
          <p className="text-lg text-gray-600">Your gift card is ready to claim</p>
        </div>

        {/* Gift Card Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#F6664C]/10 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-[#F6664C]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gift Card from {giftCard.sender_name}</h2>
              <p className="text-sm text-gray-500">To: {giftCard.recipient_name}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">Gift Amount</span>
              <span className="text-2xl font-bold text-[#185F72]">£{giftCard.amount}</span>
            </div>

            {giftCard.message && (
              <div className="bg-[#FEF3F2] border-l-4 border-[#F6664C] p-4 rounded-r-lg">
                <p className="text-sm text-gray-600 mb-1">Personal Message:</p>
                <p className="text-gray-800 italic">"{giftCard.message}"</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Invoice Number</span>
              <span className="font-mono text-gray-900">{giftCard.invoice_number}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-[#F6664C] to-[#e55a42] rounded-xl p-6 text-white mb-4">
            <h3 className="text-xl font-bold mb-2">Ready to Claim Your Reward?</h3>
            <p className="text-white/90 mb-4">
              Transfer your gift card amount directly to your bank account. It's quick, secure, and powered by Stripe.
            </p>
            <Button
              onClick={handleClaimReward}
              className="w-full bg-white text-[#F6664C] hover:bg-gray-50 font-semibold text-lg py-6"
            >
              Claim £{giftCard.amount} Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By claiming this reward, you agree to provide your bank account details for a secure transfer via Stripe.
          </p>
        </div>

        {/* Security Badge */}
        <div className="text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Secure transfer powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RewardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-[#FEF9F5] to-[#F0F9FF] flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#F6664C] animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <RewardPageContent />
    </Suspense>
  )
}
