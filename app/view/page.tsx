"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { getGiftCardByCode, updateGiftCardStatus } from "@/app/actions/gift-cards"
import { Card, CardContent } from "@/components/ui/card"
import { BankAccountForm } from "@/components/bank-account-form"

type ViewState = "loading" | "error" | "claimed" | "congrats" | "revealed" | "bank-form" | "success"

const Confetti = () => {
  const confettiCount = 50
  const colors = ["#F6664C", "#FF8A65", "#FFB74D", "#FF6B9D", "#CE93D8", "#81C784"]

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10%",
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  )
}

function ViewCardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cardData, setCardData] = useState<any>(null)
  const [uniqueCode, setUniqueCode] = useState("")
  const [error, setError] = useState("")
  const [viewState, setViewState] = useState<ViewState>("loading")
  const [showConfetti, setShowConfetti] = useState(false)
  const [senderName, setSenderName] = useState<string>("Anonymous")

  const loadGiftCard = useCallback(async (code: string) => {
    try {
      console.log("[v0] Loading gift card with code:", code)
      const result = await getGiftCardByCode(code)

      if (result.error || !result.data) {
        console.error("[v0] Error from getGiftCardByCode:", result.error)
        setError(result.error || "Gift card not found")
        setViewState("error")
        return
      }

      if (result.data.status === "Claimed") {
        setViewState("claimed")
        return
      }

      if (result.data.status === "Sent") {
        await updateGiftCardStatus(code, "Opened")
      }

      const constructedCardData = {
        recipientName: result.data.recipient_name,
        recipientEmail: result.data.recipient_email,
        amount: result.data.amount,
        message: result.data.message,
        cardImage: result.data.card_image_url,
        cardCategory: result.data.card_template,
        backCardColor: "#FFF5F0",
        backTextColor: "#185F72",
      }

      setCardData(constructedCardData)
      setSenderName(result.data.sender_name || "Anonymous")
      setViewState("congrats")
      setShowConfetti(true)
    } catch (err: any) {
      console.error("[v0] Error fetching gift card:", err)
      const errorMessage = typeof err === "string" ? err : err?.message || "Failed to load gift card"
      setError(errorMessage)
      setViewState("error")
    }
  }, [])

  useEffect(() => {
    const code = searchParams.get("code")

    if (code) {
      setUniqueCode(code)
      loadGiftCard(code)
    } else {
      setViewState("error")
      setError("No gift card code provided")
    }
  }, [searchParams, loadGiftCard])

  const handleNextFromCongrats = () => {
    setShowConfetti(false)
    setViewState("revealed")
  }

  const handleClaimGift = () => {
    setViewState("bank-form")
  }

  const handlePayoutSuccess = () => {
    setViewState("success")
    setShowConfetti(true)
  }

  const handleCancelBankForm = () => {
    setViewState("revealed")
  }

  const handleClose = () => {
    router.push("/")
  }

  // Loading state
  if (viewState === "loading") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-[#F6664C]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#F6664C] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Loading your gift...</p>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (viewState === "error") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="text-5xl sm:text-6xl mb-4">❌</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Gift Card Not Found</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {error || "We couldn't find this gift card. Please check your link and try again."}
              </p>
              <Button onClick={handleClose} className="mt-4 w-full bg-[#F6664C] hover:bg-[#e55540]">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Already claimed state
  if (viewState === "claimed") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="text-5xl sm:text-6xl mb-4">✅</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Gift Card Already Claimed</h2>
              <p className="text-sm sm:text-base text-gray-600">This gift card has already been claimed.</p>
              <Button onClick={handleClose} className="mt-6 w-full bg-[#F6664C] hover:bg-[#e55540]">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Success state after payout
  if (viewState === "success") {
    return (
      <>
        <Header />
        {showConfetti && <Confetti />}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-in zoom-in duration-300">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Payment Sent!</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Your £{cardData?.amount} gift has been successfully transferred to your bank account. It may take 3-5
                business days to appear.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-800 font-medium text-sm sm:text-base">
                  Amount transferred: £{cardData?.amount}
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-[#F6664C] hover:bg-[#e55a43] text-white py-2.5 sm:py-3"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Bank form state
  if (viewState === "bank-form") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <BankAccountForm
            uniqueCode={uniqueCode}
            amount={cardData?.amount || 0}
            recipientEmail={cardData?.recipientEmail || ""}
            recipientName={cardData?.recipientName || ""}
            onSuccess={handlePayoutSuccess}
            onCancel={handleCancelBankForm}
          />
        </div>
      </>
    )
  }

  if (viewState === "congrats") {
    return (
      <>
        <Header />
        {showConfetti && <Confetti />}

        <div className="min-h-screen bg-gray-50/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 md:p-8 relative animate-in zoom-in duration-300">
            {/* Logo */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <Image src="/images/logo.png" alt="Last Minute Cards" width={50} height={50} className="object-contain" />
            </div>

            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative w-32 h-44 sm:w-40 sm:h-56 rounded-lg overflow-hidden shadow-xl">
                {cardData?.cardImage ? (
                  <Image
                    src={cardData.cardImage || "/placeholder.svg"}
                    alt="Gift Card"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-4xl sm:text-5xl">🎁</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your digital card is ready!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Tap the button below to see what's inside</p>
            </div>

            <Button
              onClick={handleNextFromCongrats}
              className="w-full bg-[#F6664C] hover:bg-[#e55a43] text-white py-4 sm:py-5 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Open Card
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Header - removed "Card Received" */}
            <div className="text-center animate-in fade-in slide-in-from-top duration-500">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Gift Card</h1>
              <p className="text-sm sm:text-base text-gray-600">Here's your personalized gift from {senderName}</p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Front of card */}
              <div className="space-y-2 sm:space-y-3 animate-in slide-in-from-left duration-500">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 text-center">Front</h3>
                <div className="relative w-full max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  {cardData?.cardImage ? (
                    <Image
                      src={cardData.cardImage || "/placeholder.svg"}
                      alt="Gift Card Front"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-5xl sm:text-6xl md:text-8xl">🎁</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Back of card */}
              <div className="space-y-2 sm:space-y-3 animate-in slide-in-from-right duration-500">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 text-center">Back</h3>
                <div
                  className="relative w-full max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center transform hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundColor: cardData?.backCardColor || "#FFF5F0",
                    color: cardData?.backTextColor || "#185F72",
                  }}
                >
                  <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div>
                      <p className="text-xs sm:text-sm font-medium opacity-70 mb-1 sm:mb-2">To</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold">{cardData?.recipientName || "You"}</p>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                        {cardData?.message || "Wishing you all the best!"}
                      </p>
                    </div>
                    <div className="pt-2 sm:pt-3 border-t border-current/20">
                      <p className="text-xs sm:text-sm font-medium opacity-70 mb-1">From</p>
                      <p className="text-base sm:text-lg font-semibold">{senderName}</p>
                    </div>
                    <div className="pt-2 sm:pt-3 md:pt-4 border-t border-current/20">
                      <p className="text-xs sm:text-sm opacity-70 mb-1">Gift Amount</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold">£{cardData?.amount || "0"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {cardData?.amount > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-lg mx-auto animate-in fade-in duration-500 delay-200">
                <div className="text-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#185F72] mb-2">Ready to claim your gift?</h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Securely add your bank details to receive your cash gift!
                  </p>
                </div>
                <Button
                  onClick={handleClaimGift}
                  className="w-full bg-[#F6664C] hover:bg-[#e55a43] text-white py-4 sm:py-5 text-base sm:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Claim Your £{cardData?.amount} Gift
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-gray-500 mt-8 sm:mt-12">
            <p>Questions? Contact us at support@lastminutecards.com</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ViewCardPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-[#F6664C]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#F6664C] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Loading your gift...</p>
            </div>
          </div>
        </>
      }
    >
      <ViewCardContent />
    </Suspense>
  )
}
