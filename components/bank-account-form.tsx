"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { processGiftCardPayout } from "@/app/actions/stripe"
import { updateGiftCardStatus } from "@/app/actions/gift-cards"

interface BankAccountFormProps {
  uniqueCode: string
  amount: number
  recipientEmail: string
  recipientName: string
  onSuccess: () => void
  onCancel: () => void
}

export function BankAccountForm({
  uniqueCode,
  amount,
  recipientEmail,
  recipientName,
  onSuccess,
  onCancel,
}: BankAccountFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [confirmedDetails, setConfirmedDetails] = useState(false)
  const [formData, setFormData] = useState({
    accountHolderName: recipientName || "",
    routingNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountType: "checking" as "checking" | "savings",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!agreedToTerms || !confirmedDetails) {
      setError("Please agree to the terms and confirm your bank details are correct")
      return
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account numbers do not match")
      return
    }

    if (formData.routingNumber.length !== 9) {
      setError("Routing number must be 9 digits")
      return
    }

    if (formData.accountNumber.length < 4 || formData.accountNumber.length > 17) {
      setError("Please enter a valid account number")
      return
    }

    setIsProcessing(true)

    try {
      const result = await processGiftCardPayout({
        uniqueCode,
        amount,
        accountHolderName: formData.accountHolderName,
        routingNumber: formData.routingNumber,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        recipientEmail,
      })

      if (result.success) {
        await updateGiftCardStatus(uniqueCode, "Claimed")
        onSuccess()
      } else {
        setError(result.error || "Failed to process payout. Please try again.")
      }
    } catch (err: any) {
      console.error("[v0] Error in bank form submission:", err)
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const canSubmit = agreedToTerms && confirmedDetails

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0">
      <CardHeader className="text-center pb-2 px-4 sm:px-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold">Ready to claim your gift?</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-600">
          Securely add your bank details to receive your cash gift!
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="accountHolderName" className="text-xs sm:text-sm">
              Account Holder Name
            </Label>
            <Input
              id="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
              placeholder="John Doe"
              required
              disabled={isProcessing}
              className="text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="routingNumber" className="text-xs sm:text-sm">
              Routing Number
            </Label>
            <Input
              id="routingNumber"
              value={formData.routingNumber}
              onChange={(e) =>
                setFormData({ ...formData, routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) })
              }
              placeholder="9 digits"
              maxLength={9}
              required
              disabled={isProcessing}
              className="text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="accountNumber" className="text-xs sm:text-sm">
              Account Number
            </Label>
            <Input
              id="accountNumber"
              type="password"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "") })}
              placeholder="Your account number"
              required
              disabled={isProcessing}
              className="text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="confirmAccountNumber" className="text-xs sm:text-sm">
              Confirm Account Number
            </Label>
            <Input
              id="confirmAccountNumber"
              value={formData.confirmAccountNumber}
              onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value.replace(/\D/g, "") })}
              placeholder="Re-enter account number"
              required
              disabled={isProcessing}
              className="text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Account Type</Label>
            <div className="flex gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="accountType"
                  value="checking"
                  checked={formData.accountType === "checking"}
                  onChange={() => setFormData({ ...formData, accountType: "checking" })}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6664C]"
                  disabled={isProcessing}
                />
                <span>Checking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="accountType"
                  value="savings"
                  checked={formData.accountType === "savings"}
                  onChange={() => setFormData({ ...formData, accountType: "savings" })}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6664C]"
                  disabled={isProcessing}
                />
                <span>Savings</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-gray-300 text-[#F6664C] focus:ring-[#F6664C] cursor-pointer"
                disabled={isProcessing}
              />
              <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800">
                I agree to the{" "}
                <Link href="/terms" className="text-[#F6664C] underline hover:text-[#e55540]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#F6664C] underline hover:text-[#e55540]">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmedDetails}
                onChange={(e) => setConfirmedDetails(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-gray-300 text-[#F6664C] focus:ring-[#F6664C] cursor-pointer"
                disabled={isProcessing}
              />
              <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800">
                I confirm all bank details are correct. I understand that payments cannot be reversed once submitted.
              </span>
            </label>
          </div>

          {error && (
            <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Your bank details are securely processed by Stripe. We never store your full account information.</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 bg-transparent text-sm h-10 sm:h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || !canSubmit}
              className="flex-1 bg-[#F6664C] hover:bg-[#e55a43] text-white text-sm h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Claim £${amount}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
