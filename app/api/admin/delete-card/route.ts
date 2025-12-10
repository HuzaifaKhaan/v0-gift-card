import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { isAdminAuthenticated, getAdminClient } from "@/lib/supabase/admin"

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cardId } = await request.json()

    if (!cardId) {
      return NextResponse.json({ error: "Card ID is required" }, { status: 400 })
    }

    const { adminClient } = await getAdminClient()

    const { data: card, error: fetchError } = await adminClient
      .from("card_templates")
      .select("*")
      .eq("id", cardId)
      .single()

    if (fetchError || !card) {
      console.error("Card not found:", fetchError)
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const { error: deleteError } = await adminClient.from("card_templates").delete().eq("id", cardId)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete card from database" }, { status: 500 })
    }

    if (card.image_url && card.image_url.includes("blob.vercel-storage.com")) {
      try {
        await del(card.image_url)
      } catch (blobError) {
        console.error("Blob delete error (non-critical):", blobError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Card deleted successfully",
    })
  } catch (error) {
    console.error("Delete card error:", error)
    return NextResponse.json(
      { error: "Failed to delete card", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
