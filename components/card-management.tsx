"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2, Search, Filter, RefreshCw } from "lucide-react"
import { cardTemplates, getCategoryTitle, type CardTemplate } from "@/lib/card-data"

export default function CardManagement() {
  const [cards, setCards] = useState<CardTemplate[]>(cardTemplates)
  const [filteredCards, setFilteredCards] = useState<CardTemplate[]>(cardTemplates)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

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

  const handleDeleteCard = async (cardId: number) => {
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
        throw new Error("Failed to delete card")
      }

      // Remove card from local state
      setCards((prev) => prev.filter((card) => card.id !== cardId))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete card. Please try again.")
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Cards</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all card templates by category</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCards([...cardTemplates])
              setSearchQuery("")
              setSelectedCategory("all")
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by card name, category, or subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent bg-white appearance-none cursor-pointer min-w-[200px]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : getCategoryTitle(category)} ({getCardCount(category)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredCards.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No cards found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Card
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 h-28 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{card.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(card.category)}`}
                      >
                        {getCategoryTitle(card.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">{card.subcategory.replace(/-/g, " ")}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {showDeleteConfirm === card.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-gray-600 mr-2">Are you sure?</span>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            disabled={isDeleting === card.id}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === card.id ? "Deleting..." : "Yes, Delete"}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={isDeleting === card.id}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(card.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete card"
                        >
                          <Trash2 className="w-5 h-5" />
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.slice(1).map((category) => (
          <div
            key={category}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{getCategoryTitle(category)}</p>
                <p className="text-2xl font-bold text-gray-900">{getCardCount(category)}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryBadgeColor(category)}`}
              >
                <span className="text-lg font-bold">{getCardCount(category)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
