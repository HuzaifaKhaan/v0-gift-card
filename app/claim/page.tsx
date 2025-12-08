"use client"

import { useState, Suspense } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

function ClaimContent() {
  const router = useRouter()
  const [uniqueCode, setUniqueCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")

  const handleOpen = async () => {
    if (!uniqueCode.trim()) {
      setError("Please enter your unique code")
      return
    }

    setIsValidating(true)
    setError("")

    router.push(`/view?code=${uniqueCode}`)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-500">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/images/logo.png" alt="Last Minute Cards" width={60} height={60} className="object-contain" />
          </div>

          {/* Gift box illustration */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-40 h-52 sm:w-48 sm:h-64 rounded-xl overflow-hidden shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-6xl sm:text-7xl animate-bounce">🎁</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400 rounded-2xl blur-lg opacity-50 -z-10"></div>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2">A surprise made just for you</h1>

          <p className="text-center text-gray-600 mb-2 text-sm leading-relaxed">
            Enter the unique code to open your card!
          </p>

          <p className="text-center text-gray-500 mb-6 text-xs">
            (Can't find your code? Check your emails or message sent by the sender)
          </p>

          <div className="mb-6 space-y-2">
            <Label htmlFor="uniqueCode" className="text-sm font-medium text-gray-700">
              Unique Code
            </Label>
            <Input
              id="uniqueCode"
              type="text"
              placeholder="Enter your code"
              value={uniqueCode}
              onChange={(e) => {
                setUniqueCode(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOpen()
                }
              }}
              className={`w-full text-center text-lg tracking-wider h-12 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
              disabled={isValidating}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1 text-center animate-in fade-in slide-in-from-top duration-300">
                {error}
              </p>
            )}
          </div>

          <Button
            onClick={handleOpen}
            disabled={isValidating}
            className="w-full bg-[#F6664C] hover:bg-[#e55a43] text-white py-5 sm:py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isValidating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Opening...
              </span>
            ) : (
              "Open"
            )}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">🔒 Secure and encrypted</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F6664C]"></div>
          </div>
        </>
      }
    >
      <ClaimContent />
    </Suspense>
  )
}
