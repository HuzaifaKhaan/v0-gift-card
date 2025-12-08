"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Check, Copy } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cardData, setCardData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [uniqueCode, setUniqueCode] = useState("")

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setCardData(parsedData)

        const code = Math.random().toString(36).substring(2, 12).toUpperCase()
        setUniqueCode(code)

        const link = `${window.location.origin}/claim?data=${encodeURIComponent(data)}`
        setShareableLink(link)
      } catch (error) {
        console.error("Error parsing card data:", error)
      }
    }
  }, [searchParams])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (!cardData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/images/image.png" alt="Last Minute Cards" width={150} height={60} className="object-contain" />
          </div>

          {/* Card Preview */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-60 relative rounded-lg overflow-hidden shadow-lg">
              {cardData.cardImage ? (
                <Image src={cardData.cardImage || "/placeholder.svg"} alt="Your card" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-100 flex items-center justify-center">
                  <span className="text-orange-400 text-sm">Card Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your card is ready to send 🎉</h2>
            <p className="text-gray-600 text-sm">Share the link below with your loved one via text message or email.</p>
          </div>

          {/* Shareable Link */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link</label>
              <div className="relative">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 pr-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unique Code</label>
              <input
                type="text"
                value={uniqueCode}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono"
              />
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#F6664C] hover:bg-[#e55540] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </button>

          {/* Close/Return Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  )
}
