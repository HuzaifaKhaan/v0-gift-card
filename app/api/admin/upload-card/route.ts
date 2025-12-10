import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting upload process")

    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const name = formData.get("name") as string

    console.log("[v0] Form data received:", { category, name, fileSize: file?.size, fileType: file?.type })

    if (!file || !category || !name) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const filename = `cards/${category}/${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${file.name.split(".").pop()}`

    console.log("[v0] Uploading to Blob storage:", filename)

    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[v0] Blob upload successful:", blob.url)

    const supabase = await createClient()
    const { data: card, error: dbError } = await supabase
      .from("card_templates")
      .insert({
        name: name.trim(),
        image_url: blob.url,
        category: category,
        subcategory: "general", // Default subcategory
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save card to database", details: dbError.message }, { status: 500 })
    }

    console.log("[v0] Card saved to database:", card)

    return NextResponse.json({
      success: true,
      card: card,
      imageUrl: blob.url,
      message: "Card uploaded successfully",
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
