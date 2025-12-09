"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Gift, Mail, User, MessageSquare, Copy, Check, X } from "lucide-react"
import { createGiftCard } from "@/app/actions/gift-cards"
import StripeCheckout from "@/components/stripe-checkout"
import CustomCardPreview from "@/components/custom-card-preview"

function CheckoutContent() {
  const router = useRouter()
  const [cardData, setCardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [uniqueCode, setUniqueCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [confirmedDetails, setConfirmedDetails] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const hasProcessedRef = useRef(false)

  const CARD_COST = 2.5

  const totalAmount = cardData ? (cardData.amount > 0 ? cardData.amount + CARD_COST : CARD_COST) : CARD_COST

  useEffect(() => {
    const loadData = () => {
      const storedData = sessionStorage.getItem("checkoutCardData")

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setCardData(parsedData)
          const code = Math.floor(1000000000 + Math.random() * 9000000000).toString()
          setUniqueCode(code)
        } catch (error) {
          console.error("[v0] Error parsing card data:", error)
        }
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  const handlePaymentComplete = async () => {
    if (!cardData || isProcessing || hasProcessedRef.current) {
      console.log("[v0] Skipping - already processing or no card data")
      return
    }

    hasProcessedRef.current = true
    setIsProcessing(true)
    console.log("[v0] handlePaymentComplete called - creating gift card")

    try {
      const result = await createGiftCard({
        senderName: cardData.senderName || "Anonymous",
        senderEmail: cardData.senderEmail || "",
        recipientName: cardData.recipientName,
        recipientEmail: cardData.email || "",
        amount: cardData.amount,
        message: cardData.message || "",
        cardTemplate: cardData.cardCategory || "Custom",
        cardImageUrl: cardData.cardImage || "",
        uniqueCode: uniqueCode,
      })

      console.log("[v0] createGiftCard result:", result)

      if (result.error) {
        console.error("[v0] Error creating gift card:", result.error)
        alert("Payment successful but failed to create gift card record. Please contact support.")
        hasProcessedRef.current = false
        setIsProcessing(false)
        return
      }

      console.log("[v0] Gift card created successfully!")
      const link = `${window.location.origin}/view?code=${uniqueCode}`
      setShareableLink(link)
      setShowSuccessModal(true)
      setIsProcessing(false)
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("An error occurred. Please try again.")
      hasProcessedRef.current = false
      setIsProcessing(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(uniqueCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    sessionStorage.removeItem("checkoutCardData")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF7F5] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-[#F6664C] mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#FFF7F5] flex items-center justify-center p-4">
          <div className="text-center bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full">
            <div className="text-5xl sm:text-6xl mb-4">📦</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Card Data Found</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Please select a card first to proceed with checkout.
            </p>
            <button
              onClick={() => router.push("/customize")}
              className="bg-[#F6664C] hover:bg-[#e55540] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              Create a Card
            </button>
          </div>
        </div>
      </>
    )
  }

  const canProceedToPayment = agreedToTerms && confirmedDetails

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF7F5] py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#185F72] mb-4 sm:mb-6 md:mb-8">
              Complete Your Purchase
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Left Side - Order Summary */}
              <div className="order-1 lg:order-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-[#185F72] mb-4 sm:mb-6">Order Summary</h2>

                  <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <div className="w-40 h-56 sm:w-48 sm:h-64 relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-100 shadow-lg mb-4">
                      {cardData.isCustomCard && cardData.customDesign ? (
                        <CustomCardPreview customDesign={cardData.customDesign} />
                      ) : cardData.cardImage ? (
                        <Image
                          src={cardData.cardImage || "/placeholder.svg"}
                          alt="Selected card"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] flex items-center justify-center">
                          <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Gift Card</p>
                    <p className="font-semibold text-[#185F72] text-sm sm:text-base">
                      {cardData.cardCategory || "Custom Card"}
                    </p>
                  </div>

                  {/* Gift Amount */}
                  {cardData.amount > 0 && (
                    <div className="bg-[#FFF7F5] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-center">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Cash Gift</p>
                      <span className="text-2xl sm:text-3xl font-bold text-[#F6664C]">£{cardData.amount}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
                      Recipient Details
                    </h3>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6664C] flex-shrink-0" />
                      <span className="text-gray-600">Recipient:</span>
                      <span className="font-medium text-[#185F72] ml-auto truncate max-w-[120px] sm:max-w-[180px]">
                        {cardData.recipientName}
                      </span>
                    </div>

                    {cardData.email && (
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6664C] flex-shrink-0" />
                        <span className="text-gray-600">Email address:</span>
                        <span className="font-medium text-[#185F72] ml-auto truncate max-w-[120px] sm:max-w-[180px]">
                          {cardData.email}
                        </span>
                      </div>
                    )}

                    {cardData.message && (
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6664C] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Message:</span>
                        <span className="font-medium text-[#185F72] ml-auto text-right max-w-[120px] sm:max-w-[180px] line-clamp-2">
                          {cardData.message}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 mt-4 sm:mt-6 pt-3 sm:pt-4">
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Digital Card</span>
                        <span>£{CARD_COST.toFixed(2)}</span>
                      </div>
                      {cardData.amount > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Cash Gift</span>
                          <span>£{cardData.amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-semibold text-[#185F72]">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-[#F6664C]">£{totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 mt-4">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-gray-300 text-[#F6664C] focus:ring-[#F6664C] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800">
                          I agree to the{" "}
                          <Link href="/terms" className="text-[#F6664C] underline hover:text-[#e55540]">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-[#F6664C] underline hover:text-[#e55540]">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={confirmedDetails}
                          onChange={(e) => setConfirmedDetails(e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-gray-300 text-[#F6664C] focus:ring-[#F6664C] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800">
                          I confirm all card and recipient details are correct. I understand payments cannot be reversed
                          once submitted.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-4 sm:mt-6 bg-[#FFF7F5] rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#185F72]">Secure Payment</p>
                      <p className="text-xs text-gray-500">Protected by Stripe</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Payment */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 order-2 lg:order-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#185F72] mb-4 sm:mb-6">Payment Details</h2>

                {isProcessing ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-[#F6664C] mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Processing your order...</p>
                    <p className="text-xs text-gray-500 mt-2">Please wait while we create your gift card...</p>
                  </div>
                ) : canProceedToPayment ? (
                  <StripeCheckout
                    amount={totalAmount}
                    recipientName={cardData.recipientName}
                    recipientEmail={cardData.email || ""}
                    senderName={cardData.senderName || "Anonymous"}
                    message={cardData.message || ""}
                    uniqueCode={uniqueCode}
                    onComplete={handlePaymentComplete}
                  />
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Please agree to the terms and confirm your details to proceed with payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 md:p-8 relative animate-in zoom-in duration-500 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all cursor-pointer hover:scale-110"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-center text-[#185F72] mb-2">Your card is on its way!</h2>
            <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
              Your card is already on its way to your loved one's email (if they have one), however, you can also share
              the link and unique code below via text/messaging apps.
            </p>

            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-20 h-28 sm:w-28 sm:h-36 relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                {cardData.isCustomCard && cardData.customDesign ? (
                  <CustomCardPreview customDesign={cardData.customDesign} />
                ) : cardData.cardImage ? (
                  <Image src={cardData.cardImage || "/placeholder.svg"} alt="Card" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] flex items-center justify-center">
                    <span className="text-white text-4xl sm:text-6xl">🎁</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-[#185F72] mb-1.5 sm:mb-2">
                Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#FFF7F5] rounded-lg p-2 sm:p-3 border border-[#F6664C]/20 min-w-0">
                  <p className="text-xs text-gray-700 break-all leading-relaxed truncate">{shareableLink}</p>
                </div>
                <button
                  onClick={copyLink}
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    copied ? "bg-green-500 text-white" : "bg-[#F6664C] hover:bg-[#e55540] text-white"
                  }`}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-[#185F72] mb-1.5 sm:mb-2">
                Unique Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#FFF7F5] rounded-lg p-2 sm:p-3 border border-[#F6664C]/20">
                  <p className="text-base sm:text-lg font-bold text-[#185F72] tracking-widest text-center">
                    {uniqueCode}
                  </p>
                </div>
                <button
                  onClick={copyCode}
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    codeCopied ? "bg-green-500 text-white" : "bg-[#F6664C] hover:bg-[#e55540] text-white"
                  }`}
                >
                  {codeCopied ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={copyLink}
                className="flex-1 bg-[#F6664C] hover:bg-[#e55540] text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                Copy Link
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-[#185F72] hover:bg-[#134a5a] text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF7F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F6664C]"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
