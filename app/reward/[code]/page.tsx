"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { BankAccountForm } from "@/components/bank-account-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getGiftCardByCode, updateGiftCardStatus } from "@/app/actions/gift-cards"
import { Gift, Clock, Check, ShieldCheck, AlertCircle } from "lucide-react"

export default function RewardClaimPage() {
  const params = useParams()
  const router = useRouter()
  const encodedCode = params.code as string

  const [giftCard, setGiftCard] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showBankForm, setShowBankForm] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [enteredCode, setEnteredCode] = useState("")
  const [authError, setAuthError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [encodedCode])

  const handleVerifyCode = async () => {
    if (!enteredCode.trim()) {
      setAuthError("Please enter your unique code")
      return
    }

    setIsVerifying(true)
    setAuthError("")

    try {
      const result = await getGiftCardByCode(enteredCode.trim())

      if (result.error || !result.data) {
        setAuthError("Invalid unique code. Please check and try again.")
        setIsVerifying(false)
        return
      }

      setGiftCard(result.data)
      setIsVerified(true)
      setShowAuthDialog(false)
      setEnteredCode("")

      if (result.data.status === "Sent") {
        await updateGiftCardStatus(enteredCode.trim(), "Opened")
      }
    } catch (err) {
      console.error("[v0] Error verifying code:", err)
      setAuthError("Unable to verify code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClaimClick = () => {
    if (giftCard.amount > 0) {
      setShowBankForm(true)
    } else {
      markAsClaimed()
    }
  }

  const markAsClaimed = async () => {
    try {
      await updateGiftCardStatus(giftCard.unique_code, "Claimed")
      setClaimSuccess(true)
    } catch (err) {
      console.error("[v0] Error marking as claimed:", err)
    }
  }

  const handlePayoutSuccess = () => {
    setShowBankForm(false)
    setClaimSuccess(true)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F6664C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your gift...</p>
          </div>
        </div>
      </>
    )
  }

  if (!isVerified) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Your Gift</h2>
              <p className="text-gray-600 mb-6">Enter your unique code to view and claim your cash gift</p>
            </CardContent>
          </Card>

          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl p-0 overflow-hidden">
              <div className="bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-center text-2xl font-bold text-white mb-2">
                  Verify Your Identity
                </DialogTitle>
                <DialogDescription className="text-center text-white/90 text-sm">
                  Enter your unique code to claim this gift
                </DialogDescription>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unique-code" className="text-[#185F72] font-semibold text-sm">
                    Unique Code
                  </Label>
                  <Input
                    id="unique-code"
                    placeholder="Enter your code"
                    value={enteredCode}
                    onChange={(e) => {
                      setEnteredCode(e.target.value)
                      setAuthError("")
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleVerifyCode()
                      }
                    }}
                    className="text-lg font-mono tracking-wider uppercase border-2 border-gray-300 focus:border-[#F6664C] focus:ring-2 focus:ring-[#F6664C]/20 rounded-lg py-6 text-center bg-gray-50 focus:bg-white transition-colors"
                    maxLength={20}
                    autoFocus
                  />
                  {authError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-[#FFF7F5] to-[#FFF0ED] border-2 border-[#F6664C]/30 rounded-xl p-4 text-sm shadow-sm">
                  <p className="font-semibold text-[#185F72] mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span> Where to find your code:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-1">
                    <li className="flex items-start gap-2">
                      <span className="text-[#F6664C] font-bold mt-0.5">•</span>
                      <span>Check the email sent by the sender</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F6664C] font-bold mt-0.5">•</span>
                      <span>Ask the sender for the unique code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F6664C] font-bold mt-0.5">•</span>
                      <span>It's a combination of letters and numbers</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-6 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || !enteredCode.trim()}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#F6664C] to-[#FF8A6C] hover:from-[#e55540] hover:to-[#ff7a5a] text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isVerifying ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Verify & Continue
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </>
    )
  }

  if (showBankForm) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <BankAccountForm
            uniqueCode={giftCard.unique_code}
            amount={giftCard.amount}
            recipientEmail={giftCard.recipient_email}
            recipientName={giftCard.recipient_name}
            onSuccess={handlePayoutSuccess}
            onCancel={() => setShowBankForm(false)}
          />
        </div>
      </>
    )
  }

  if (claimSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">
                {giftCard.amount > 0
                  ? `Your £${giftCard.amount} has been sent to your bank account. It should arrive within 3-5 business days.`
                  : "You've successfully received your gift card!"}
              </p>
              <Button onClick={() => router.push("/")} className="bg-[#F6664C] hover:bg-[#e55540] text-white">
                Done
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (giftCard.status === "Claimed") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Claimed</h2>
              <p className="text-gray-600 mb-6">This gift card has already been claimed.</p>
              <Button onClick={() => router.push("/")} className="bg-[#F6664C] hover:bg-[#e55540] text-white">
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Gift Card</h1>
            <p className="text-gray-600">From {giftCard.sender_name}</p>
          </div>

          <div className="max-w-md mx-auto mb-8">
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
                  {giftCard.card_image_url ? (
                    <Image
                      src={giftCard.card_image_url || "/placeholder.svg"}
                      alt="Gift Card Front"
                      fill
                      className="object-cover pointer-events-none select-none"
                      priority
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] flex items-center justify-center">
                      <Gift className="w-24 h-24 text-white" />
                    </div>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#FFF5F0] to-[#FFE8DD] flex flex-col items-center justify-center p-8 text-center border-2 border-[#F6664C]/20"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="space-y-5 text-[#185F72]">
                    <div>
                      <p className="text-sm font-medium opacity-70 mb-2">To</p>
                      <p className="text-2xl font-bold">{giftCard.recipient_name}</p>
                    </div>

                    {giftCard.message && (
                      <div className="py-4 border-y border-current/20">
                        <p className="text-base leading-relaxed italic">"{giftCard.message}"</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium opacity-70 mb-1">From</p>
                      <p className="text-xl font-semibold">{giftCard.sender_name}</p>
                    </div>

                    {giftCard.amount > 0 && (
                      <div className="pt-4 border-t border-current/20">
                        <p className="text-sm opacity-70 mb-1">Gift Amount</p>
                        <p className="text-4xl font-bold text-[#F6664C]">£{giftCard.amount}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">Click card to flip</p>
          </div>
          {/* </CHANGE> */}

          {giftCard.amount > 0 && (
            <Card className="max-w-lg mx-auto shadow-xl animate-in fade-in duration-500 delay-200">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#185F72] mb-2">Ready to claim your gift?</h2>
                  <p className="text-gray-600">Securely withdraw your cash gift to your bank account</p>
                </div>

                <Button
                  onClick={handleClaimClick}
                  className="w-full bg-[#F6664C] hover:bg-[#e55540] text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Claim £{giftCard.amount} Now
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">🔒 Secure transaction powered by Stripe</p>
              </CardContent>
            </Card>
          )}

          <Card className="max-w-lg mx-auto mt-6 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Gift Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold">{giftCard.recipient_name}</span>
                </div>
                {giftCard.recipient_email && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{giftCard.recipient_email}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold">{giftCard.sender_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">{giftCard.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
