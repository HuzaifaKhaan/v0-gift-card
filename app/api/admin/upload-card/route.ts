import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

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

    const filename = `${category}-${name.toLowerCase().replace(/\s+/g, "-")}.${file.name.split(".").pop()}`

    console.log("[v0] Uploading to Blob storage:", filename)

    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({
      success: true,
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
