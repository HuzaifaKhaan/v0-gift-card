import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const subcategory = formData.get("subcategory") as string
    const name = formData.get("name") as string

    if (!file || !category || !subcategory || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create filename from card name
    const filename = `${category}-${subcategory}-${name.toLowerCase().replace(/\s+/g, "-")}.${file.name.split(".").pop()}`

    // Ensure public directory exists
    const publicDir = join(process.cwd(), "public")
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Save file to public directory
    const filepath = join(publicDir, filename)
    await writeFile(filepath, buffer)

    // Return the public URL path
    const imageUrl = `/${filename}`

    // TODO: Add card to database or card-data.ts file
    // For now, we'll just return success
    // You would need to implement database storage or update the card-data.ts file

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "Card uploaded successfully",
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
