"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { getGiftCardByCode } from "@/app/actions/gift-cards"
import Image from "next/image"
import { BankAccountForm } from "@/components/bank-account-form"

export default function ClaimRewardPage() {
  const [step, setStep] = useState<"enter-code" | "verified" | "claim-reward">("enter-code")
  const [uniqueCode, setUniqueCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")
  const [giftCard, setGiftCard] = useState<any>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false)

  const handleValidateCode = async () => {
    if (!uniqueCode.trim()) {
      setError("Please enter your unique code")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      const result = await getGiftCardByCode(uniqueCode.trim())

      if (result.error || !result.data) {
        setError(result.error || "Invalid or expired code. Please check and try again.")
        setIsValidating(false)
        return
      }

      // Check if already claimed
      if (result.data.status === "Claimed") {
        setError("This gift card has already been claimed.")
        setIsValidating(false)
        return
      }

      // Success! Store the gift card data
      setGiftCard(result.data)
      setStep("verified")
      setError("")
    } catch (err: any) {
      setError("An error occurred. Please try again.")
      console.error("[v0] Error validating code:", err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleClaimReward = () => {
    setStep("claim-reward")
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Step 1: Enter Code */}
          {step === "enter-code" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F6664C] to-[#ff8c73] rounded-full mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Your Reward</h1>
                  <p className="text-gray-600">Enter your unique code to get started</p>
                </div>
                {/* Code input */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code" className="text-sm font-medium text-[#185F72] mb-2 block text-center">
                      Unique Code
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter your unique code"
                      value={uniqueCode}
                      onChange={(e) => {
                        setUniqueCode(e.target.value.toUpperCase())
                        setError("")
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleValidateCode()
                        }
                      }}
                      className="text-center text-lg tracking-widest uppercase font-mono h-14 border-2 focus:border-[#F6664C] focus:ring-[#F6664C]"
                      disabled={isValidating}
                    />
                    {error && (
                      <div className="mt-3 flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg animate-in fade-in slide-in-from-top duration-300">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleValidateCode}
                    disabled={isValidating || !uniqueCode.trim()}
                    className="w-full h-14 text-lg font-semibold bg-[#F6664C] hover:bg-[#e55a43] text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isValidating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Validating...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Validate Code
                      </>
                    )}
                  </Button>
                </div>

                {/* Info box */}
                <div className="mt-6 bg-gradient-to-br from-[#FFF7F5] to-[#fff0ed] border border-[#F6664C]/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-700 flex items-start gap-2 justify-center">
                    <span className="text-[#F6664C] font-bold">•</span>
                    <span>Your unique code was provided when the gift card was sent to you</span>
                  </p>
                  <p className="text-sm text-gray-700 flex items-start gap-2 mt-2 justify-center">
                    <span className="text-[#F6664C] font-bold">•</span>
                    <span>Check your email or the message from the sender</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Code Verified - Show Claim Button */}
          {step === "verified" && giftCard && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom duration-500">
                {/* Success header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 animate-in zoom-in duration-500">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Code Verified!</h1>
                  <p className="text-gray-600">Your gift card is ready to view</p>
                </div>

                {/* Gift card preview */}
                <div className="bg-gradient-to-br from-[#FFF7F5] to-[#fff0ed] rounded-xl p-6 mb-6 border border-[#F6664C]/20">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">From:</span>
                      <span className="font-semibold text-gray-900">{giftCard.sender_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">To:</span>
                      <span className="font-semibold text-gray-900">{giftCard.recipient_name}</span>
                    </div>
                    {giftCard.amount > 0 && (
                      <div className="flex justify-between items-center pt-3 border-t border-[#F6664C]/20">
                        <span className="text-sm text-gray-600">Gift Amount:</span>
                        <span className="text-2xl font-bold text-[#F6664C]">£{giftCard.amount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {giftCard.amount > 0 ? (
                  <Button
                    onClick={handleClaimReward}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#F6664C] to-[#ff8c73] hover:from-[#e55a43] hover:to-[#ff7b5e] text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    View your Gift
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">This is a card-only gift with no cash amount.</p>
                    <Button
                      onClick={handleClaimReward}
                      className="w-full h-14 text-lg font-semibold bg-[#185F72] hover:bg-[#144a58] text-white"
                    >
                      View your Gift
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Claim Reward - Show Card & Withdrawal Form with flip functionality */}
          {step === "claim-reward" && giftCard && (
            <div className="animate-in fade-in slide-in-from-bottom duration-500">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Gift Card</h1>
                <p className="text-gray-600">View your card and claim your reward below</p>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex justify-center">
                  {/* Front Card with Flip */}
                  <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom duration-700">
                    <div
                      className="cursor-pointer"
                      style={{
                        perspective: "1000px",
                        WebkitPerspective: "1000px",
                      }}
                    >
                      <div
                        className="relative w-full aspect-[3/4] rounded-xl shadow-2xl"
                        style={{
                          transformStyle: "preserve-3d",
                          WebkitTransformStyle: "preserve-3d",
                          transition: "transform 0.6s",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {/* Front */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                          }}
                        >
                          <Image
                            src={giftCard.card_image_url || giftCard.card_template || "/placeholder.svg"}
                            alt="Gift Card Front"
                            fill
                            className="object-cover pointer-events-none select-none"
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                          />
                        </div>

                        {/* Back */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-[#FFF7F5] to-[#fff0ed] p-6 flex flex-col justify-between shadow-lg border border-[#F6664C]/20"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">To:</p>
                              <p className="text-xl font-bold text-[#185F72]">{giftCard.recipient_name}</p>
                            </div>

                            {giftCard.message && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Message:</p>
                                <p className="text-sm text-gray-700 italic leading-relaxed">{giftCard.message}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 pt-4 border-t border-[#F6664C]/20">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">From:</p>
                              <p className="text-lg font-semibold text-gray-900">{giftCard.sender_name}</p>
                            </div>

                            {giftCard.amount > 0 && (
                              <div className="bg-white rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Gift Amount</p>
                                <p className="text-3xl font-bold text-[#F6664C]">£{giftCard.amount}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-3">Click card to flip</p>
                  </div>
                </div>
              </div>

              {giftCard.amount > 0 && !showWithdrawalForm && (
                <div className="max-w-md mx-auto text-center animate-in fade-in zoom-in duration-700 delay-200">
                  <Button
                    onClick={() => setShowWithdrawalForm(true)}
                    className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-[#F6664C] to-[#ff8c73] hover:from-[#e55a43] hover:to-[#ff7b5e] text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl"
                  >
                    <Gift className="w-6 h-6 mr-2" />
                    Ready to claim your gift?
                  </Button>
                </div>
              )}

              {/* Withdrawal Form - only show when button is clicked */}
              {giftCard.amount > 0 && showWithdrawalForm && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-700 delay-200">
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Your £{giftCard.amount}</h2>
                    <p className="text-gray-600">
                      Enter your bank account details below to receive your gift via Stripe
                    </p>
                  </div>

                  <BankAccountForm uniqueCode={giftCard.unique_code} amount={giftCard.amount} />
                </div>
              )}

              {giftCard.amount === 0 && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F6664C] to-[#ff8c73] rounded-full mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enjoy Your Card!</h3>
                  <p className="text-gray-600">This is a thoughtful card-only gift with no cash amount.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
