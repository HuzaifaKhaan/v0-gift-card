"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  ImageIcon,
  Type,
  Palette,
  Gift,
  X,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Maximize,
  Minimize,
  Square,
  RectangleHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const backgroundColors = [
  { name: "White", value: "#FFFFFF" },
  { name: "Cream", value: "#FFF8E7" },
  { name: "Blush", value: "#FFE5E0" },
  { name: "Mint", value: "#E0F5F0" },
  { name: "Lavender", value: "#E8E0F5" },
  { name: "Sky", value: "#E0F0F5" },
  { name: "Peach", value: "#FFE5D0" },
  { name: "Rose", value: "#F5E0E8" },
  { name: "Teal", value: "#185F72" },
  { name: "Coral", value: "#F6664C" },
  { name: "Navy", value: "#1a365d" },
  { name: "Forest", value: "#1a4d3e" },
]

const fontFamilies = [
  { name: "Classic", value: "Georgia, serif" },
  { name: "Modern", value: "Arial, sans-serif" },
  { name: "Elegant", value: "'Times New Roman', serif" },
  { name: "Playful", value: "'Comic Sans MS', cursive" },
  { name: "Clean", value: "'Helvetica Neue', sans-serif" },
  { name: "Bold", value: "Impact, sans-serif" },
]

const patterns = [
  { name: "None", value: "none" },
  { name: "Dots", value: "dots" },
  { name: "Stripes", value: "stripes" },
  { name: "Confetti", value: "confetti" },
  { name: "Hearts", value: "hearts" },
  { name: "Stars", value: "stars" },
]

const imageFitOptions = [
  { name: "Fill", value: "fill", icon: Maximize, description: "Fill entire card" },
  { name: "Fit", value: "contain", icon: Minimize, description: "Fit inside card" },
  { name: "Cover", value: "cover", icon: Square, description: "Cover with crop" },
  { name: "Custom", value: "custom", icon: RectangleHorizontal, description: "Custom size & position" },
]

export default function CreatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Image state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 })
  const [imageScale, setImageScale] = useState(100)
  const [imageFitMode, setImageFitMode] = useState<"fill" | "contain" | "cover" | "custom">("fill")

  // Design state
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [pattern, setPattern] = useState("none")
  const [cardTitle, setCardTitle] = useState("")
  const [titleFont, setTitleFont] = useState("Georgia, serif")
  const [titleSize, setTitleSize] = useState(24)
  const [titleColor, setTitleColor] = useState("#333333")
  const [titleAlign, setTitleAlign] = useState<"left" | "center" | "right">("center")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [titlePosition, setTitlePosition] = useState<"top" | "center" | "bottom">("bottom")

  // Form state
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const [includeGift, setIncludeGift] = useState(true)
  const [amount, setAmount] = useState(20)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [senderName, setSenderName] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)

  // Preview state
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState<"design" | "details">("design")

  const cashAmounts = [10, 25, 50, 100, 250, 500]

  const getActualAmount = () => {
    if (isCustomAmount && customAmount) return Number(customAmount)
    return amount
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getPatternStyle = () => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }
      case "stripes":
        return {
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)`,
        }
      case "confetti":
        return {
          backgroundImage: `radial-gradient(circle at 20% 30%, #F6664C 2px, transparent 2px),
                           radial-gradient(circle at 80% 20%, #185F72 2px, transparent 2px),
                           radial-gradient(circle at 40% 70%, #FFD700 2px, transparent 2px),
                           radial-gradient(circle at 60% 50%, #FF69B4 2px, transparent 2px)`,
          backgroundSize: "100px 100px",
        }
      case "hearts":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFB6C1' opacity='0.3'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }
      case "stars":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFD700' opacity='0.3'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }
      default:
        return {}
    }
  }

  const getImageStyles = (): React.CSSProperties => {
    switch (imageFitMode) {
      case "fill":
        return {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }
      case "contain":
        return {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: "10px",
        }
      case "cover":
        return {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }
      case "custom":
        return {
          position: "absolute",
          left: `${imagePosition.x}%`,
          top: `${imagePosition.y}%`,
          transform: "translate(-50%, -50%)",
          width: `${imageScale}%`,
          height: "auto",
          maxWidth: "none",
          objectFit: "contain",
        }
      default:
        return {}
    }
  }

  const getTitlePositionStyle = (): React.CSSProperties => {
    switch (titlePosition) {
      case "top":
        return { top: "10%", bottom: "auto" }
      case "center":
        return { top: "50%", transform: "translateY(-50%)" }
      case "bottom":
      default:
        return { bottom: "10%", top: "auto" }
    }
  }

  const handleContinue = () => {
    const checkoutData = {
      recipientName,
      email: recipientEmail,
      message,
      amount: includeGift ? getActualAmount() : 0,
      cardImage: uploadedImage || "/custom-gift-card.jpg",
      cardCategory: "Custom Card",
      senderName: isAnonymous ? "Anonymous" : senderName,
      isCustomCard: true,
      customDesign: {
        backgroundColor,
        pattern,
        cardTitle,
        titleFont,
        titleSize,
        titleColor,
        titleAlign,
        titlePosition,
        isBold,
        isItalic,
        uploadedImage,
        imagePosition,
        imageScale,
        imageFitMode,
      },
    }

    sessionStorage.setItem("checkoutCardData", JSON.stringify(checkoutData))
    router.push("/checkout")
  }

  const isFormValid =
    recipientName &&
    // recipientEmail &&
    // message &&
    (includeGift ? getActualAmount() > 0 : true) &&
    (isAnonymous || senderName)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Page Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Create Your <span className="text-[#F6664C]">Own Card</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Upload your own image and design a unique card from scratch
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Card Preview */}
          <div className="order-1 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#F6664C]" />
                Live Preview
              </h2>

              {/* Flip Card Container */}
              <div
                className="relative mx-auto cursor-pointer"
                style={{
                  perspective: "1000px",
                  maxWidth: "320px",
                  WebkitPerspective: "1000px",
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="relative aspect-[3/4] w-full transition-transform duration-700"
                  style={{
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    WebkitTransform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front of Card */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                      WebkitTransform: "rotateY(0deg)",
                    }}
                  >
                    <div
                      className="w-full h-full relative flex flex-col items-center justify-center"
                      style={{
                        backgroundColor,
                        ...getPatternStyle(),
                      }}
                    >
                      {uploadedImage && (
                        <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" style={getImageStyles()} />
                      )}

                      {/* Card Title with preview when empty */}
                      <div className="absolute left-0 right-0 px-4 z-10" style={getTitlePositionStyle()}>
                        <p
                          className="drop-shadow-lg"
                          style={{
                            fontFamily: titleFont,
                            fontSize: `${titleSize}px`,
                            color: cardTitle ? titleColor : "rgba(100,100,100,0.5)",
                            fontWeight: isBold ? "bold" : "normal",
                            fontStyle: isItalic ? "italic" : "normal",
                            textAlign: titleAlign,
                            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                          }}
                        >
                          {cardTitle || "Your Title Here"}
                        </p>
                      </div>

                      {/* Amount Badge */}
                      {includeGift && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg z-20">
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#185F72]">
                            £{getActualAmount()}
                          </span>
                        </div>
                      )}

                      {/* Placeholder if no image */}
                      {!uploadedImage && !cardTitle && (
                        <div className="text-center text-gray-400 z-10">
                          <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Upload an image or add text</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#185F72] to-[#0d3d4a]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      WebkitTransform: "rotateY(180deg)",
                    }}
                  >
                    <div className="aspect-[3/4] flex flex-col justify-between p-4 sm:p-6 text-white">
                      <div>
                        <p className="text-xs sm:text-sm opacity-80 mb-1">To:</p>
                        <p className="text-base sm:text-lg font-semibold">{recipientName || "Recipient Name"}</p>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm opacity-80 mb-2">Message</p>
                          <p className="text-sm sm:text-base italic leading-relaxed">
                            "{message || "Your personal message will appear here..."}"
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs sm:text-sm opacity-80 mb-1">From:</p>
                        <p className="text-base sm:text-lg font-semibold">
                          {isAnonymous ? "Anonymous" : senderName || "Your Name"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">Click card to flip</p>
            </div>
          </div>

          {/* Right Column - Design Controls */}
          <div className="order-2 lg:order-2 space-y-4 sm:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 flex gap-1">
              <button
                onClick={() => setActiveTab("design")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "design" ? "bg-[#F6664C] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Palette className="h-4 w-4 inline mr-2" />
                Design Card
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "details" ? "bg-[#F6664C] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Gift className="h-4 w-4 inline mr-2" />
                Card Details
              </button>
            </div>

            {activeTab === "design" && (
              <>
                {/* Image Upload */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </h3>

                  {!uploadedImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#F6664C] hover:bg-[#FFF7F5] transition-all"
                    >
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload an image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded"
                          className="w-full h-40 object-contain bg-gray-100"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Image Fit Mode</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {imageFitOptions.map((option) => {
                            const IconComponent = option.icon
                            return (
                              <button
                                key={option.value}
                                onClick={() => setImageFitMode(option.value as typeof imageFitMode)}
                                className={`p-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                  imageFitMode === option.value
                                    ? "bg-[#185F72] text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                title={option.description}
                              >
                                <IconComponent className="h-4 w-4" />
                                {option.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {imageFitMode === "custom" && (
                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Label className="text-xs text-gray-600">Image Size: {imageScale}%</Label>
                            <Slider
                              value={[imageScale]}
                              onValueChange={(value) => setImageScale(value[0])}
                              min={20}
                              max={200}
                              step={5}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-gray-600">Position X: {imagePosition.x}%</Label>
                              <Slider
                                value={[imagePosition.x]}
                                onValueChange={(value) => setImagePosition({ ...imagePosition, x: value[0] })}
                                min={0}
                                max={100}
                                step={5}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Position Y: {imagePosition.y}%</Label>
                              <Slider
                                value={[imagePosition.y]}
                                onValueChange={(value) => setImagePosition({ ...imagePosition, y: value[0] })}
                                min={0}
                                max={100}
                                step={5}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Background Color */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Background Color
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setBackgroundColor(color.value)}
                        className={`aspect-square rounded-lg border-2 transition-all cursor-pointer hover:scale-110 ${
                          backgroundColor === color.value ? "border-[#F6664C] ring-2 ring-[#F6664C]" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Pattern */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Background Pattern
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patterns.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPattern(p.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          pattern === p.value
                            ? "bg-[#185F72] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Card Title
                  </h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="e.g., Happy Birthday!"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="text-lg"
                    />

                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Font Style</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {fontFamilies.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => setTitleFont(font.value)}
                            className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
                              titleFont === font.value
                                ? "bg-[#185F72] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Text Size: <span className="text-[#F6664C] text-lg">{titleSize}px</span>
                      </Label>
                      <Slider
                        value={[titleSize]}
                        onValueChange={(value) => setTitleSize(value[0])}
                        min={12}
                        max={48}
                        step={2}
                        className="mt-2 h-3"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Small (12px)</span>
                        <span>Large (48px)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Text Color</Label>
                        <input
                          type="color"
                          value={titleColor}
                          onChange={(e) => setTitleColor(e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Title Position</Label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTitlePosition("top")}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            titlePosition === "top"
                              ? "bg-[#185F72] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Top
                        </button>
                        <button
                          onClick={() => setTitlePosition("center")}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            titlePosition === "center"
                              ? "bg-[#185F72] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Center
                        </button>
                        <button
                          onClick={() => setTitlePosition("bottom")}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            titlePosition === "bottom"
                              ? "bg-[#185F72] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Bottom
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsBold(!isBold)}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          isBold ? "bg-[#185F72] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          isItalic ? "bg-[#185F72] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => setTitleAlign("left")}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          titleAlign === "left"
                            ? "bg-[#185F72] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title="Align Left"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTitleAlign("center")}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          titleAlign === "center"
                            ? "bg-[#185F72] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title="Align Center"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTitleAlign("right")}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          titleAlign === "right"
                            ? "bg-[#185F72] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title="Align Right"
                      >
                        <AlignRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Continue to Details Button */}
                <Button
                  onClick={() => setActiveTab("details")}
                  className="w-full bg-[#185F72] hover:bg-[#134a59] text-white py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Continue to Card Details
                </Button>
              </>
            )}

            {activeTab === "details" && (
              <>
                {/* Gift Amount */}
                <div>
                  {/* Cash Gift Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Cash Gift (Optional)
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{includeGift ? "Included" : "Card only"}</span>
                      <button
                        onClick={() => setIncludeGift(!includeGift)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#185F72] focus:ring-offset-2 cursor-pointer ${
                          includeGift ? "bg-[#F6664C]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            includeGift ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {includeGift ? (
                    <>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                        {cashAmounts.map((cashAmount) => (
                          <button
                            key={cashAmount}
                            onClick={() => {
                              setAmount(cashAmount)
                              setIsCustomAmount(false)
                              setCustomAmount("")
                            }}
                            className={`py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                              amount === cashAmount && !isCustomAmount
                                ? "bg-[#185F72] text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            £{cashAmount}
                          </button>
                        ))}
                        <button
                          onClick={() => setIsCustomAmount(true)}
                          className={`py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                            isCustomAmount
                              ? "bg-[#185F72] text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Custom
                        </button>
                      </div>

                      {isCustomAmount && (
                        <div className="mt-3">
                          <Label htmlFor="customAmount" className="text-sm text-gray-700">
                            Enter custom amount
                          </Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                              £
                            </span>
                            <Input
                              id="customAmount"
                              type="number"
                              min="1"
                              max="10000"
                              placeholder="Enter amount"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                      Send a beautiful card without a cash gift
                    </p>
                  )}
                </div>

                {/* Recipient Details */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                    Recipient Details
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="recipientName" className="text-sm text-gray-700">
                        Recipient Name
                      </Label>
                      <Input
                        id="recipientName"
                        placeholder="Enter recipient's name"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail" className="text-sm text-gray-700">
                        Recipient Email
                      </Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="Enter recipient's email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm text-gray-700">
                        Personal Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Write a heartfelt message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="mt-1 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sender Details */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                    Your Details
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Send anonymously
                        </Label>
                        <p className="text-xs text-gray-500 mt-0.5">Hide your name from the recipient</p>
                      </div>
                      <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#185F72] focus:ring-offset-2 cursor-pointer ${
                          isAnonymous ? "bg-[#F6664C]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            isAnonymous ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {!isAnonymous && (
                      <div>
                        <Label htmlFor="senderName" className="text-sm text-gray-700">
                          Your Name
                        </Label>
                        <Input
                          id="senderName"
                          placeholder="Enter your name"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  className="w-full bg-[#F6664C] hover:bg-[#e55a42] text-white py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Continue to Checkout
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
