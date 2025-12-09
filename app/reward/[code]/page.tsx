"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { BankAccountForm } from "@/components/bank-account-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { decodeGiftCode, getGiftCardByCode, updateGiftCardStatus } from "@/app/actions/gift-cards"
import { Gift, Clock, Check, X, ShieldCheck, AlertCircle } from "lucide-react"

export default function RewardClaimPage() {
  const params = useParams()
  const router = useRouter()
  const encodedCode = params.code as string

  const [giftCard, setGiftCard] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showBankForm, setShowBankForm] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [enteredCode, setEnteredCode] = useState("")
  const [authError, setAuthError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    loadGiftCard()
  }, [encodedCode])

  const loadGiftCard = async () => {
    try {
      setIsLoading(true)
      setError("")

      const uniqueCode = await decodeGiftCode(encodedCode)
      console.log("[v0] Decoded unique code:", uniqueCode)

      const result = await getGiftCardByCode(uniqueCode)

      if (result.error || !result.data) {
        setError(result.error || "Gift card not found")
        setIsLoading(false)
        return
      }

      setGiftCard(result.data)

      // Update status to Opened if not already
      if (result.data.status === "Sent") {
        await updateGiftCardStatus(uniqueCode, "Opened")
      }

      setIsLoading(false)
    } catch (err: any) {
      console.error("[v0] Error loading gift card:", err)
      setError(err?.message || "Invalid or expired link")
      setIsLoading(false)
    }
  }

  const handleClaimClick = () => {
    setShowAuthDialog(true)
    setEnteredCode("")
    setAuthError("")
  }

  const handleVerifyCode = async () => {
    if (!enteredCode.trim()) {
      setAuthError("Please enter your unique code")
      return
    }

    setIsVerifying(true)
    setAuthError("")

    try {
      const decodedUniqueCode = await decodeGiftCode(encodedCode)

      // Compare entered code with the actual unique code
      if (enteredCode.trim().toUpperCase() === decodedUniqueCode.toUpperCase()) {
        // Code matches! Close dialog and proceed
        setShowAuthDialog(false)
        setEnteredCode("")

        if (giftCard.amount > 0) {
          setShowBankForm(true)
        } else {
          // Card only, no bank details needed
          markAsClaimed()
        }
      } else {
        setAuthError("Incorrect unique code. Please check and try again.")
      }
    } catch (err) {
      console.error("[v0] Error verifying code:", err)
      setAuthError("Unable to verify code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const markAsClaimed = async () => {
    try {
      const uniqueCode = await decodeGiftCode(encodedCode)
      await updateGiftCardStatus(uniqueCode, "Claimed")
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

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push("/")} className="bg-[#F6664C] hover:bg-[#e55540] text-white">
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
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
                  ? `Your £${giftCard.amount} has been sent to your bank account. It should arrive within 1-3 business days.`
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
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#F6664C] to-[#FF8A6C] p-6 text-center text-white">
              <Gift className="w-12 h-12 mx-auto mb-3" />
              <h1 className="text-3xl font-bold mb-2">You've Got a Gift!</h1>
              <p className="text-white/90">From {giftCard.sender_name}</p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Card Preview */}
              {giftCard.card_image_url && (
                <div className="flex justify-center">
                  <div className="relative w-64 h-80 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={giftCard.card_image_url || "/placeholder.svg"}
                      alt="Gift Card"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Personal Message */}
              {giftCard.message && (
                <div className="bg-[#FFF7F5] border-l-4 border-[#F6664C] p-4 rounded-r-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Personal Message:</p>
                  <p className="text-gray-800 italic">"{giftCard.message}"</p>
                </div>
              )}

              {/* Amount Display */}
              {giftCard.amount > 0 && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <p className="text-gray-600 text-sm mb-1">Cash Gift Amount</p>
                  <p className="text-5xl font-bold text-green-600">£{giftCard.amount}</p>
                </div>
              )}

              {/* Recipient Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold">{giftCard.recipient_name}</span>
                </div>
                {giftCard.recipient_email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{giftCard.recipient_email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold">{giftCard.sender_name}</span>
                </div>
              </div>

              {/* Claim Button */}
              <Button
                onClick={handleClaimClick}
                className="w-full bg-[#F6664C] hover:bg-[#e55540] text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {giftCard.amount > 0 ? `Claim £${giftCard.amount} Now` : "Claim Gift Card"}
              </Button>

              <p className="text-xs text-gray-500 text-center">🔒 Secure transaction powered by Stripe</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md border-2 border-[#F6664C]/20 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-[#185F72]">Verify Your Identity</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Please enter your unique code to claim this gift. You should have received this code via email or from the
              sender.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unique-code" className="text-[#185F72] font-semibold">
                Unique Code
              </Label>
              <Input
                id="unique-code"
                placeholder="Enter your unique code"
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
                className="text-lg font-mono tracking-wider uppercase border-2 border-gray-300 focus:border-[#F6664C] focus:ring-[#F6664C] rounded-lg py-6"
                maxLength={20}
                autoFocus
              />
              {authError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <div className="bg-[#FFF7F5] border-2 border-[#F6664C]/30 rounded-lg p-4 text-sm">
              <p className="font-semibold text-[#185F72] mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span> Where to find your code:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 ml-1">
                <li>Check the email sent to you by the sender</li>
                <li>Ask the sender for the unique code</li>
                <li>It's a combination of letters and numbers</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAuthDialog(false)
                setEnteredCode("")
                setAuthError("")
              }}
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifying || !enteredCode.trim()}
              className="w-full sm:w-auto bg-[#F6664C] hover:bg-[#e55540] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
