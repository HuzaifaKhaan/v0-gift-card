import { Suspense } from "react"
import { CategoryCardsClient } from "./category-cards-client"

interface PageProps {
  params: Promise<{
    category: string
    subcategory: string
  }>
}

export default async function CategoryCardsPage({ params }: PageProps) {
  const { category, subcategory } = await params

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F6664C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cards...</p>
          </div>
        </div>
      }
    >
      <CategoryCardsClient category={category} subcategory={subcategory} />
    </Suspense>
  )
}
