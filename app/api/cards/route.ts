import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const subcategory = searchParams.get("subcategory")

    const supabase = await createClient()

    let query = supabase.from("card_templates").select("*").order("created_at", { ascending: true })

    if (category) {
      query = query.eq("category", category)
    }

    if (subcategory) {
      query = query.eq("subcategory", subcategory)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching cards:", error)
      return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
    }

    return NextResponse.json({ cards: data || [] })
  } catch (error) {
    console.error("[v0] Cards API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch cards", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
