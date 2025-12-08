"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cardTemplates } from "@/lib/card-data"

function CustomizeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const templateId = searchParams.get("template")
  const categoryParam = searchParams.get("category")

  const initialTemplateIndex = templateId ? cardTemplates.findIndex((c) => c.id === Number.parseInt(templateId)) : 0

  const [selectedCard, setSelectedCard] = useState(initialTemplateIndex >= 0 ? initialTemplateIndex : 0)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All")
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Form state
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const [includeGift, setIncludeGift] = useState(true)
  const [amount, setAmount] = useState(20)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [senderName, setSenderName] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)

  const categories = ["All", "Birthdays", "Well Wishes", "Seasonal", "Milestone Moments"]
  const cashAmounts = [5, 10, 20, 50, 100, 200]

  const categoryMap: Record<string, string> = {
    Birthdays: "birthdays",
    "Well Wishes": "well-wishes",
    Seasonal: "seasonal",
    "Milestone Moments": "milestone-moments",
  }

  const filteredCards =
    selectedCategory === "All"
      ? cardTemplates
      : cardTemplates.filter((card) => card.category === categoryMap[selectedCategory])

  const cardsPerPage = 6
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  const startIndex = currentPage * cardsPerPage
  const displayedCards = filteredCards.slice(startIndex, startIndex + cardsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getActualAmount = () => {
    if (!includeGift) return 0
    if (isCustomAmount && customAmount) return Number(customAmount)
    return amount
  }

  const handleContinue = () => {
    const selectedTemplate = filteredCards[selectedCard] || cardTemplates[selectedCard] || cardTemplates[0]
    const actualAmount = getActualAmount()

    const checkoutData = {
      recipientName,
      email: recipientEmail,
      message,
      amount: actualAmount,
      cardImage: selectedTemplate.image,
      cardCategory: selectedTemplate.name,
      senderName: isAnonymous ? "Anonymous" : senderName,
    }

    sessionStorage.setItem("checkoutCardData", JSON.stringify(checkoutData))
    router.push("/checkout")
  }

  const isFormValid =
    recipientName && recipientEmail && message && (isAnonymous || senderName) && (!includeGift || getActualAmount() > 0)

  const currentCard = filteredCards[selectedCard] || cardTemplates[0]
  const displayAmount = getActualAmount()

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
      setCurrentPage(0)
      setSelectedCard(0)
    }
  }, [categoryParam])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Page Title */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Create Your Gift Card
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">Customize your card and add a personal touch</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Card Preview */}
          <div className="order-1 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#F6664C]" />
                Card Preview
              </h2>

              {/* Flip Card Container */}
              <div
                className="relative mx-auto cursor-pointer"
                style={{
                  perspective: "1000px",
                  maxWidth: "320px",
                  WebkitPerspective: "1000px",
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="relative aspect-[3/4] w-full transition-transform duration-700"
                  style={{
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    WebkitTransform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front of Card */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                      WebkitTransform: "rotateY(0deg)",
                    }}
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={currentCard.image || "/placeholder.svg"}
                        alt={currentCard.name}
                        fill
                        className="object-cover"
                      />
                      {includeGift && displayAmount > 0 && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#185F72]">
                            £{displayAmount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#185F72] to-[#0d3d4a]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      WebkitTransform: "rotateY(180deg)",
                    }}
                  >
                    <div className="aspect-[3/4] flex flex-col justify-between p-4 sm:p-6 text-white">
                      <div>
                        <p className="text-xs sm:text-sm opacity-80 mb-1">To:</p>
                        <p className="text-base sm:text-lg font-semibold">{recipientName || "Recipient Name"}</p>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm opacity-80 mb-2">Message</p>
                          <p className="text-sm sm:text-base italic leading-relaxed">
                            "{message || "Your personal message will appear here..."}"
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs sm:text-sm opacity-80 mb-1">From:</p>
                        <p className="text-base sm:text-lg font-semibold">
                          {isAnonymous ? "Anonymous" : senderName || "Your Name"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">Click card to flip</p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="order-2 lg:order-2 space-y-4 sm:space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">Categories</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setCurrentPage(0)
                      setSelectedCard(0)
                    }}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      selectedCategory === category
                        ? "bg-[#F6664C] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Template</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <button
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-medium">
                    {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {displayedCards.map((card, index) => (
                  <div key={card.id} className="space-y-1.5 sm:space-y-2">
                    <div
                      className={`aspect-[3/4] relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-md ${
                        selectedCard === startIndex + index
                          ? "border-[#F6664C] ring-2 ring-[#F6664C] ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCard(startIndex + index)}
                    >
                      <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                    </div>
                    <p className="text-xs text-gray-600 text-center truncate">{card.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cash Gift (Optional)</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{includeGift ? "Included" : "Card only"}</span>
                  <button
                    onClick={() => setIncludeGift(!includeGift)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#185F72] focus:ring-offset-2 cursor-pointer ${
                      includeGift ? "bg-[#F6664C]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        includeGift ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {includeGift && (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                    {cashAmounts.map((cashAmount) => (
                      <button
                        key={cashAmount}
                        onClick={() => {
                          setAmount(cashAmount)
                          setIsCustomAmount(false)
                          setCustomAmount("")
                        }}
                        className={`py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                          amount === cashAmount && !isCustomAmount
                            ? "bg-[#185F72] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        £{cashAmount}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustomAmount(true)}
                      className={`py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                        isCustomAmount
                          ? "bg-[#185F72] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {isCustomAmount && (
                    <div className="mt-3">
                      <Label htmlFor="customAmount" className="text-sm text-gray-700">
                        Enter custom amount
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">£</span>
                        <Input
                          id="customAmount"
                          type="number"
                          min="1"
                          max="10000"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {!includeGift && (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  Send a beautiful card without a cash gift
                </p>
              )}
            </div>

            {/* Recipient Details */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                Recipient Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="recipientName" className="text-sm text-gray-700">
                    Recipient Name
                  </Label>
                  <Input
                    id="recipientName"
                    placeholder="Enter recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientEmail" className="text-sm text-gray-700">
                    Recipient Email
                  </Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter recipient's email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm text-gray-700">
                    Personal Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Write a heartfelt message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="mt-1 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">Your Details</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Send anonymously
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">Hide your name from the recipient</p>
                  </div>
                  <button
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#185F72] focus:ring-offset-2 cursor-pointer ${
                      isAnonymous ? "bg-[#F6664C]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        isAnonymous ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {!isAnonymous && (
                  <div>
                    <Label htmlFor="senderName" className="text-sm text-gray-700">
                      Your Name
                    </Label>
                    <Input
                      id="senderName"
                      placeholder="Enter your name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!isFormValid}
              className="w-full bg-[#F6664C] hover:bg-[#e55a42] text-white py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Gift className="h-5 w-5 mr-2" />
              {includeGift ? "Continue to Checkout" : "Send Card"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F6664C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <CustomizeContent />
    </Suspense>
  )
}
