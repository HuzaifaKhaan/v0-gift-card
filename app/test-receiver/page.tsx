"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGiftCard } from "@/app/actions/gift-cards"
import { Copy, Gift, ExternalLink } from "lucide-react"

export default function TestReceiverPage() {
  const [formData, setFormData] = useState({
    recipientName: "Test Recipient",
    recipientEmail: "recipient@test.com",
    senderName: "Test Sender",
    senderEmail: "sender@test.com",
    message: "This is a test gift card!",
    amount: "25",
    cardImageUrl: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const handleCreateTestGiftCard = async () => {
    setIsCreating(true)
    setResult(null)

    try {
      const uniqueCode = `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

      const giftCardData = {
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        message: formData.message,
        amount: Number.parseFloat(formData.amount) || 0,
        cardImageUrl: formData.cardImageUrl || "/gift-card-assortment.png",
        cardTemplate: "default", // Add required cardTemplate parameter
        uniqueCode: uniqueCode, // Add required uniqueCode parameter
      }

      const response = await createGiftCard(giftCardData)

      if (response.error) {
        setResult({ error: response.error })
      } else {
        setResult(response.data)
      }
    } catch (error) {
      console.error("[v0] Error creating test gift card:", error)
      setResult({ error: "Failed to create test gift card" })
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F6664C] to-[#FF8A6C] rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Gift Card Receiver</h1>
            <p className="text-gray-600">Create a test gift card to test the receiving and claiming flow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create Test Gift Card</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      placeholder="recipient@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <Label htmlFor="senderEmail">Sender Email (optional)</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      placeholder="sender@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Happy Birthday!"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (£)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="25"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardImageUrl">Card Image URL (optional)</Label>
                    <Input
                      id="cardImageUrl"
                      value={formData.cardImageUrl}
                      onChange={(e) => setFormData({ ...formData, cardImageUrl: e.target.value })}
                      placeholder="Leave empty for default"
                    />
                  </div>

                  <Button
                    onClick={handleCreateTestGiftCard}
                    disabled={isCreating}
                    className="w-full bg-[#F6664C] hover:bg-[#e55540] text-white py-6 text-lg font-semibold"
                  >
                    {isCreating ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Create Test Gift Card
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <div>
              {result && !result.error && (
                <Card className="shadow-xl bg-green-50 border-2 border-green-200">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Gift className="w-6 h-6" />
                      Gift Card Created!
                    </h2>

                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <Label className="text-sm text-gray-600 mb-1 block">Unique Code</Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-lg font-mono font-bold text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                            {result.unique_code}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(result.unique_code)}
                            className="flex-shrink-0"
                          >
                            {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <Label className="text-sm text-gray-600 mb-2 block">Claim URL</Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded border border-gray-200 break-all">
                            {`${window.location.origin}/reward/${result.unique_code}`}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(`${window.location.origin}/reward/${result.unique_code}`)}
                            className="flex-shrink-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => window.open(`/reward/${result.unique_code}`, "_blank")}
                          className="w-full bg-[#F6664C] hover:bg-[#e55540] text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Gift Card (New Tab)
                        </Button>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Gift Card Details</h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-600">To:</span> {result.recipient_name}
                          </p>
                          <p>
                            <span className="text-gray-600">From:</span> {result.sender_name}
                          </p>
                          <p>
                            <span className="text-gray-600">Amount:</span> £{result.amount}
                          </p>
                          <p>
                            <span className="text-gray-600">Status:</span>{" "}
                            <span className="font-semibold text-green-600">{result.status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result && result.error && (
                <Card className="shadow-xl bg-red-50 border-2 border-red-200">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
                    <p className="text-red-700">{result.error}</p>
                  </CardContent>
                </Card>
              )}

              {!result && (
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Test Instructions</h2>
                    <div className="space-y-4 text-sm text-gray-600">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">What this does:</h3>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Creates a gift card in your database</li>
                          <li>Generates a unique claim code</li>
                          <li>Provides you with a claim URL</li>
                          <li>Lets you test the receiving flow</li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">To test:</h3>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Fill out the form with test data</li>
                          <li>Click "Create Test Gift Card"</li>
                          <li>Copy the unique code or URL</li>
                          <li>Open the gift card page to test viewing</li>
                          <li>Test the claim flow with bank details</li>
                        </ol>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 font-semibold mb-1">Note:</p>
                        <p className="text-yellow-700 text-sm">
                          The email sending is configured but won't send actual emails in test mode. Check your console
                          logs to see the email content.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
