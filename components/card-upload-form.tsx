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
  { value: "birthdays", label: "Birthdays", subcategories: ["number-cards", "photo-cards", "funny-cards"] },
  { value: "well-wishes", label: "Well Wishes", subcategories: ["congratulations", "good-luck", "treat-yourself"] },
  { value: "seasonal", label: "Seasonal", subcategories: ["christmas", "halloween", "easter", "valentines"] },
  {
    value: "milestone-moments",
    label: "Milestone Moments",
    subcategories: ["new-job", "new-baby", "new-home", "wedding", "retirement", "new-car", "just-passed"],
  },
]

export function CardUploadForm() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const currentCategory = CATEGORIES.find((cat) => cat.value === selectedCategory)

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
    if (!cardFile || !selectedCategory || !selectedSubcategory || !cardName.trim()) {
      setErrorMessage("Please fill in all fields and select a card image")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", cardFile)
      formData.append("category", selectedCategory)
      formData.append("subcategory", selectedSubcategory)
      formData.append("name", cardName.trim())

      const response = await fetch("/api/admin/upload-card", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      setUploadStatus("success")
      // Reset form
      setCardFile(null)
      setPreviewUrl(null)
      setCardName("")
      setSelectedCategory("")
      setSelectedSubcategory("")
      setErrorMessage("")

      // Auto-reset success message after 3 seconds
      setTimeout(() => setUploadStatus("idle"), 3000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadStatus("error")
      setErrorMessage("Failed to upload card. Please try again.")
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-name" className="text-sm font-medium text-gray-700 mb-2 block">
              Card Name
            </Label>
            <Input
              id="card-name"
              type="text"
              placeholder="e.g., Happy Birthday Balloons"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="border-gray-300 focus:border-[#4ECDC4] focus:ring-[#4ECDC4]"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
              Category
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-gray-300 focus:border-[#4ECDC4] focus:ring-[#4ECDC4]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentCategory && (
            <div>
              <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700 mb-2 block">
                Subcategory
              </Label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="border-gray-300 focus:border-[#4ECDC4] focus:ring-[#4ECDC4]">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategory.subcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Card Image</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="card-file"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/5 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">{cardFile ? cardFile.name : "Choose image (max 5MB)"}</span>
              </label>
              <input id="card-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended: 300x400px (3:4 ratio)</p>
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
              <span>Card uploaded successfully!</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || !cardFile || !selectedCategory || !selectedSubcategory || !cardName.trim()}
            className="w-full bg-[#4ECDC4] hover:bg-[#3db8af] text-white font-semibold py-6"
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
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
          <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden relative">
            {previewUrl ? (
              <>
                <Image src={previewUrl || "/placeholder.svg"} alt="Card preview" fill className="object-cover" />
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">No image selected</p>
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
