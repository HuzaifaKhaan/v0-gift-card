import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { isAdminAuthenticated, getAdminClient } from "@/lib/supabase/admin"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const name = formData.get("name") as string

    if (!file || !category || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" },
        { status: 400 },
      )
    }

    const sanitizedName = name.trim().substring(0, 100) // Limit length
    const sanitizedCategory = category.trim().toLowerCase()

    const filename = `cards/${sanitizedCategory}/${sanitizedName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${file.name.split(".").pop()}`

    const blob = await put(filename, file, {
      access: "public",
    })

    const { adminClient } = await getAdminClient()
    const { data: card, error: dbError } = await adminClient
      .from("card_templates")
      .insert({
        name: sanitizedName,
        image_url: blob.url,
        category: sanitizedCategory,
        subcategory: "general",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save card to database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      card: card,
      imageUrl: blob.url,
      message: "Card uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
