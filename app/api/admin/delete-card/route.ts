import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const { cardId } = await request.json()

    if (!cardId) {
      return NextResponse.json({ error: "Card ID is required" }, { status: 400 })
    }

    console.log("[v0] Deleting card with ID:", cardId)

    const supabase = await createClient()

    const { data: card, error: fetchError } = await supabase
      .from("card_templates")
      .select("*")
      .eq("id", cardId)
      .single()

    if (fetchError || !card) {
      console.error("[v0] Card not found:", fetchError)
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const { error: deleteError } = await supabase.from("card_templates").delete().eq("id", cardId)

    if (deleteError) {
      console.error("[v0] Database delete error:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete card from database", details: deleteError.message },
        { status: 500 },
      )
    }

    if (card.image_url && card.image_url.includes("blob.vercel-storage.com")) {
      try {
        await del(card.image_url)
        console.log("[v0] Blob deleted successfully")
      } catch (blobError) {
        console.error("[v0] Blob delete error (non-critical):", blobError)
        // Continue even if blob delete fails - card is already removed from DB
      }
    }

    console.log("[v0] Card deleted successfully")

    return NextResponse.json({
      success: true,
      message: "Card deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Delete card error:", error)
    return NextResponse.json(
      { error: "Failed to delete card", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
