import { createClient } from "@/lib/supabase/client"

export interface CardTemplate {
  id: string
  name: string
  image_url: string
  category: string
  subcategory: string
  created_at: string
  updated_at: string
}

// For backwards compatibility with existing code
export interface LegacyCardTemplate {
  id: number
  image: string
  name: string
  category: string
  subcategory: string
}

// Convert database card to legacy format for existing components
export function toLegacyFormat(card: CardTemplate, index: number): LegacyCardTemplate {
  return {
    id: index + 1,
    image: card.image_url,
    name: card.name,
    category: card.category,
    subcategory: card.subcategory,
  }
}

// Fetch all cards from Supabase
export async function getAllCards(): Promise<CardTemplate[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("card_templates").select("*").order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching cards:", error)
    return []
  }

  return data || []
}

// Fetch cards by category
export async function getCardsByCategory(category: string): Promise<CardTemplate[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("card_templates")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching cards by category:", error)
    return []
  }

  return data || []
}

// Fetch cards by category and subcategory
export async function getCardsByCategoryAndSubcategory(category: string, subcategory: string): Promise<CardTemplate[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("card_templates")
    .select("*")
    .eq("category", category)
    .eq("subcategory", subcategory)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching cards by subcategory:", error)
    return []
  }

  return data || []
}

// Fetch a single card by ID
export async function getCardById(id: string): Promise<CardTemplate | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("card_templates").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching card by ID:", error)
    return null
  }

  return data
}

// Create a new card
export async function createCard(card: {
  name: string
  image_url: string
  category: string
  subcategory?: string
}): Promise<CardTemplate | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("card_templates")
    .insert({
      name: card.name,
      image_url: card.image_url,
      category: card.category,
      subcategory: card.subcategory || "general",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating card:", error)
    return null
  }

  return data
}

// Delete a card
export async function deleteCard(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("card_templates").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting card:", error)
    return false
  }

  return true
}

// Helper functions for titles
export function getCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    birthdays: "Birthdays",
    "well-wishes": "Well Wishes",
    seasonal: "Seasonal",
    "love-relationships": "Love and Relationships",
  }
  return titles[category] || category
}

export function getSubcategoryTitle(subcategory: string): string {
  const titles: Record<string, string> = {
    "number-cards": "Number Cards",
    "photo-cards": "Photo Cards",
    "funny-cards": "Funny Cards",
    congratulations: "Congratulations",
    "good-luck": "Good Luck",
    "treat-yourself": "Treat Yourself",
    "new-baby": "New Baby",
    "new-home": "New Home",
    "thank-you": "Thank You",
    christmas: "Christmas",
    halloween: "Halloween",
    easter: "Easter",
    valentines: "Valentines",
    "mothers-day": "Mother's Day",
    "fathers-day": "Father's Day",
    anniversary: "Anniversary",
    "love-romance": "Love & Romance",
    wedding: "Wedding",
    general: "General",
  }
  return titles[subcategory] || subcategory
}
