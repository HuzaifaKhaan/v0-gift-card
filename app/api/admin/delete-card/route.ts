import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createClient } from "@supabase/supabase-js"

export async function DELETE(request: NextRequest) {
  try {
    console.log("[v0] DELETE /api/admin/delete-card - Starting...")

    const { cardId } = await request.json()

    if (!cardId) {
      return NextResponse.json({ error: "Card ID is required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the card first to retrieve the image URL
    const { data: card, error: fetchError } = await supabase
      .from("card_templates")
      .select("*")
      .eq("id", cardId)
      .single()

    if (fetchError || !card) {
      console.error("[v0] Card not found:", fetchError)
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    // Delete the card from database
    const { error: deleteError } = await supabase.from("card_templates").delete().eq("id", cardId)

    if (deleteError) {
      console.error("[v0] Database delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete card from database" }, { status: 500 })
    }

    // Delete the image from Vercel Blob if it exists
    if (card.image_url && card.image_url.includes("blob.vercel-storage.com")) {
      try {
        await del(card.image_url)
        console.log("[v0] Image deleted from blob storage")
      } catch (blobError) {
        console.error("[v0] Blob delete error (non-critical):", blobError)
      }
    }

    console.log("[v0] Card deleted successfully:", cardId)
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
