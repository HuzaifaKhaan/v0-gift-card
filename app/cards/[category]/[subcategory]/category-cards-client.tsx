"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Gift, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCategoryTitle, getSubcategoryTitle, type CardTemplate } from "@/lib/card-service"

interface CategoryCardsClientProps {
  category: string
  subcategory: string
}

export function CategoryCardsClient({ category, subcategory }: CategoryCardsClientProps) {
  const [cards, setCards] = useState<CardTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const categoryTitle = getCategoryTitle(category)
  const subcategoryTitle = getSubcategoryTitle(subcategory)

  useEffect(() => {
    async function fetchCards() {
      try {
        // Fetch cards by category (subcategory filtering can be added if needed)
        const response = await fetch(`/api/cards?category=${category}`)
        const data = await response.json()
        if (data.cards) {
          // Filter by subcategory if not "general"
          const filteredCards =
            subcategory === "all"
              ? data.cards
              : data.cards.filter(
                  (card: CardTemplate) => card.subcategory === subcategory || card.subcategory === "general",
                )
          setCards(filteredCards)
        }
      } catch (error) {
        console.error("[v0] Error fetching cards:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCards()
  }, [category, subcategory])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-[#185F72] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700">{categoryTitle}</span>
          <span>/</span>
          <span className="text-[#185F72] font-medium">{subcategoryTitle}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {subcategoryTitle} Cards
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Browse our beautiful collection of {subcategoryTitle.toLowerCase()} gift cards. Select a design and
            customize it with your personal message.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#185F72] mx-auto mb-4" />
              <p className="text-gray-500">Loading cards...</p>
            </div>
          </div>
        ) : cards.length > 0 ? (
          /* Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/customize?template=${card.id}&category=${category}&subcategory=${subcategory}`}
                className="group"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#185F72]/30">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={card.image_url || "/placeholder.svg"}
                      alt={card.name}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        hoveredCard === card.id ? "scale-110" : "scale-100"
                      }`}
                    />
                    {/* Overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-[#185F72]/60 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredCard === card.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="text-center text-white p-4">
                        <Gift className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">Customize Card</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{card.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Click to customize</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No cards found</h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6">We're adding new designs soon. Check back later!</p>
            <Link href="/">
              <Button className="bg-[#185F72] hover:bg-[#134a59] text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        )}

        {/* Back button */}
        {cards.length > 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <Link href="/">
              <Button variant="outline" className="border-[#185F72] text-[#185F72] hover:bg-[#185F72]/5 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
