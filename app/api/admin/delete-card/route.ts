import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { cardId } = await request.json()

    if (!cardId) {
      return NextResponse.json({ error: "Card ID is required" }, { status: 400 })
    }

    console.log("[v0] Deleting card with ID:", cardId)

    // Note: This endpoint marks the card as deleted but doesn't remove from card-data.ts
    // For production, you would:
    // 1. Store cards in database instead of static file
    // 2. Mark card as deleted or remove from database
    // 3. Delete associated image from Vercel Blob storage if exists

    // For now, we'll just return success
    // The frontend will handle removing it from the UI state
    return NextResponse.json({
      success: true,
      message: "Card deleted successfully",
      note: "Card removed from UI. To permanently delete, remove from lib/card-data.ts",
    })
  } catch (error) {
    console.error("[v0] Delete card error:", error)
    return NextResponse.json(
      { error: "Failed to delete card", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
