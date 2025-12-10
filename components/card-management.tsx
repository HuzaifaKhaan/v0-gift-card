"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import Image from "next/image"
import { Trash2, Search, Filter, RefreshCw, Loader2 } from "lucide-react"
import { getCategoryTitle, type CardTemplate } from "@/lib/card-service"

export interface CardManagementRef {
  refreshCards: () => Promise<void>
}

const CardManagement = forwardRef<CardManagementRef>((props, ref) => {
  const [cards, setCards] = useState<CardTemplate[]>([])
  const [filteredCards, setFilteredCards] = useState<CardTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCards = useCallback(async () => {
    console.log("[v0] Fetching cards from API...")
    setIsLoading(true)
    try {
      const response = await fetch("/api/cards", {
        cache: "no-store", // Disable caching to always get fresh data
      })
      const data = await response.json()
      console.log("[v0] Fetched cards:", data.cards?.length || 0)
      if (data.cards) {
        setCards(data.cards)
        setFilteredCards(data.cards)
      }
    } catch (error) {
      console.error("[v0] Error fetching cards:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    refreshCards: fetchCards,
  }))

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(cards.map((card) => card.category)))]

  // Filter cards based on category and search
  useEffect(() => {
    let filtered = cards

    if (selectedCategory !== "all") {
      filtered = filtered.filter((card) => card.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.subcategory.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredCards(filtered)
  }, [selectedCategory, searchQuery, cards])

  const handleDeleteCard = async (cardId: string) => {
    setIsDeleting(cardId)

    try {
      const response = await fetch("/api/admin/delete-card", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete card")
      }

      // Remove card from local state
      setCards((prev) => prev.filter((card) => card.id !== cardId))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert(error instanceof Error ? error.message : "Failed to delete card. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      birthdays: "bg-purple-100 text-purple-700 border-purple-200",
      "well-wishes": "bg-blue-100 text-blue-700 border-blue-200",
      seasonal: "bg-green-100 text-green-700 border-green-200",
      "love-relationships": "bg-pink-100 text-pink-700 border-pink-200",
    }
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getCardCount = (category: string) => {
    if (category === "all") return cards.length
    return cards.filter((card) => card.category === category).length
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4ECDC4] mx-auto mb-4" />
          <p className="text-gray-500">Loading cards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Manage Cards</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all card templates by category</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCards}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by card name, category, or subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:min-w-[200px] pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent bg-white appearance-none cursor-pointer text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : getCategoryTitle(category)} ({getCardCount(category)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredCards.length === 0 ? (
          <div className="p-8 lg:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">No cards found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters, or upload new cards</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Card
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="w-16 h-20 lg:w-20 lg:h-28 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                          src={card.image_url || "/placeholder.svg"}
                          alt={card.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <span className="font-medium text-gray-900 text-sm">{card.name}</span>
                      <span className="sm:hidden block mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeColor(card.category)}`}
                        >
                          {getCategoryTitle(card.category)}
                        </span>
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 lg:px-6 py-3 lg:py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(card.category)}`}
                      >
                        {getCategoryTitle(card.category)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-4">
                      <span className="text-sm text-gray-600 capitalize">{card.subcategory.replace(/-/g, " ")}</span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                      {showDeleteConfirm === card.id ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                          <span className="text-xs lg:text-sm text-gray-600 mr-0 sm:mr-2">Are you sure?</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              disabled={isDeleting === card.id}
                              className="px-2 lg:px-3 py-1.5 bg-red-600 text-white text-xs lg:text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {isDeleting === card.id ? "Deleting..." : "Yes"}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              disabled={isDeleting === card.id}
                              className="px-2 lg:px-3 py-1.5 bg-gray-200 text-gray-700 text-xs lg:text-sm rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(card.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 lg:w-5 h-4 lg:h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {categories.slice(1).map((category) => (
          <div
            key={category}
            className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs lg:text-sm text-gray-500 mb-1 truncate">{getCategoryTitle(category)}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{getCardCount(category)}</p>
              </div>
              <div
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${getCategoryBadgeColor(category)}`}
              >
                <span className="text-base lg:text-lg font-bold">{getCardCount(category)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

CardManagement.displayName = "CardManagement"

export default CardManagement
