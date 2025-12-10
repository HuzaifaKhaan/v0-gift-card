"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import Image from "next/image"

const CATEGORIES = [
  { value: "birthdays", label: "Birthdays" },
  { value: "well-wishes", label: "Well Wishes" },
  { value: "seasonal", label: "Seasonal" },
  { value: "love-relationships", label: "Love and Relationships" },
]

interface CardUploadFormProps {
  onUploadSuccess?: () => void
}

export function CardUploadForm({ onUploadSuccess }: CardUploadFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB")
        return
      }
      setCardFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setErrorMessage("")
    }
  }

  const handleUpload = async () => {
    if (!cardFile || !selectedCategory || !cardName.trim()) {
      setErrorMessage("Please fill in all fields and select a card image")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")
    console.log("[v0] Starting upload with:", { category: selectedCategory, name: cardName, fileSize: cardFile.size })

    try {
      const formData = new FormData()
      formData.append("file", cardFile)
      formData.append("category", selectedCategory)
      formData.append("name", cardName.trim())

      console.log("[v0] Sending request to /api/admin/upload-card")

      const response = await fetch("/api/admin/upload-card", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Response status:", response.status)

      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (!response.ok) {
        throw new Error(data.details || data.error || "Upload failed")
      }

      setUploadStatus("success")
      // Reset form
      setCardFile(null)
      setPreviewUrl(null)
      setCardName("")
      setSelectedCategory("")
      setErrorMessage("")

      if (onUploadSuccess) {
        onUploadSuccess()
      }

      // Auto-reset success message after 3 seconds
      setTimeout(() => setUploadStatus("idle"), 3000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload card. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const clearPreview = () => {
    setCardFile(null)
    setPreviewUrl(null)
    setErrorMessage("")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Form */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="card-name" className="text-sm font-medium text-[#185F72] mb-2 block">
              Card Name
            </Label>
            <Input
              id="card-name"
              type="text"
              placeholder="e.g., Happy Birthday Balloons"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border-gray-300 focus:border-[#F6664C] focus:ring-[#F6664C]"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-[#185F72] mb-2 block">
              Category
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full border-gray-300 focus:border-[#F6664C] focus:ring-[#F6664C]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="bg-white hover:bg-gray-100 cursor-pointer">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-[#185F72] mb-2 block">Card Image</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="card-file"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F6664C] hover:bg-[#FFF7F5] transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 truncate">{cardFile ? cardFile.name : "Choose image"}</span>
              </label>
              <input id="card-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: 300x400px (3:4 ratio) • Max 5MB</p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Card uploaded successfully! It will now appear across the app.</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || !cardFile || !selectedCategory || !cardName.trim()}
            className="w-full bg-gradient-to-r from-[#F6664C] to-[#FF8A75] hover:from-[#e55540] hover:to-[#f77a63] text-white font-semibold py-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Card
              </>
            )}
          </Button>
        </div>

        {/* Right column - Preview */}
        <div>
          <Label className="text-sm font-medium text-[#185F72] mb-2 block">Preview</Label>
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden relative">
            {previewUrl ? (
              <>
                <Image src={previewUrl || "/placeholder.svg"} alt="Card preview" fill className="object-cover" />
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                  aria-label="Clear preview"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No image selected</p>
                  <p className="text-xs mt-1">Upload to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardUploadForm
