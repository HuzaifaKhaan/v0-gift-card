"use server"

import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Create Supabase client with service role for server-side operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const resend = new Resend(process.env.RESEND_API_KEY)

function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LMC-${timestamp}-${random}`
}

export async function createGiftCard({
  senderName,
  senderEmail,
  recipientName,
  recipientEmail,
  amount,
  message,
  cardTemplate,
  cardImageUrl,
  uniqueCode,
}: {
  senderName: string
  senderEmail: string
  recipientName: string
  recipientEmail: string
  amount: number
  message: string
  cardTemplate: string
  cardImageUrl: string
  uniqueCode: string
}) {
  try {
    const invoiceNumber = generateInvoiceNumber()

    const { data, error } = await supabase
      .from("gift_cards")
      .insert({
        sender_name: senderName,
        sender_email: senderEmail,
        recipient_name: recipientName,
        recipient_email: recipientEmail,
        amount: amount,
        message: message,
        card_template: cardTemplate,
        card_image_url: cardImageUrl,
        unique_code: uniqueCode,
        invoice_number: invoiceNumber,
        status: "Sent",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase insert error:", error)
      return { error: error.message }
    }

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lastminutecards.vercel.app"
      const viewLink = `${appUrl}/view?code=${uniqueCode}`

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "LastMinuteCards <hello@lastminutecards.com>",
        replyTo: "support@lastminutecards.com",
        to: recipientEmail,
        subject: `${senderName} sent you a gift card`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <title>You've received a gift card</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 32px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                        <h1 style="color: #F6664C; font-size: 28px; margin: 0 0 8px 0; font-weight: 700;">You've received a gift</h1>
                        <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">${senderName} has sent you something special</p>
                      </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 32px 40px;">
                        <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">Hello ${recipientName},</p>
                        <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">You have received a digital gift card${amount > 0 ? ` with £${amount}` : ""}. Click the button below to view your personalized card:</p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="width: 100%; margin: 24px 0;">
                          <tr>
                            <td align="center">
                              <a href="${viewLink}" style="display: inline-block; background-color: #F6664C; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Your Gift Card</a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Unique Code Box -->
                        <table role="presentation" style="width: 100%; background-color: #f3f4f6; border-radius: 8px; margin-top: 24px;">
                          <tr>
                            <td style="padding: 16px;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Your unique code:</p>
                              <p style="color: #374151; font-size: 24px; font-weight: 700; font-family: 'Courier New', Courier, monospace; margin: 0; letter-spacing: 2px;">${uniqueCode}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0 0; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${viewLink}" style="color: #F6664C; word-break: break-all;">${viewLink}</a></p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 24px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; text-align: center; line-height: 1.5;">This email was sent because ${senderName} sent you a gift card from LastMinuteCards.</p>
                        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">© 2025 LastMinuteCards UK. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `
Hello ${recipientName},

${senderName} has sent you a gift card${amount > 0 ? ` with £${amount}` : ""}!

View your gift card here: ${viewLink}

Your unique code: ${uniqueCode}

If you have any questions, please contact us at support@lastminutecards.com

© 2025 LastMinuteCards UK. All rights reserved.
        `,
      })

      console.log("[v0] Email sent successfully to:", recipientEmail)
    } catch (emailError) {
      console.error("[v0] Email send error:", emailError)
      // Don't fail the gift card creation if email fails
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creating gift card:", error)
    return { error: error?.message || "Failed to create gift card" }
  }
}

export async function getGiftCardByCode(uniqueCode: string) {
  try {
    const { data, error } = await supabase.from("gift_cards").select("*").eq("unique_code", uniqueCode).single()

    if (error) {
      console.error("[v0] Error fetching gift card:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error: any) {
    console.error("[v0] Error in getGiftCardByCode:", error)
    return { error: error?.message || "Failed to fetch gift card" }
  }
}

export async function updateGiftCardStatus(uniqueCode: string, status: "Sent" | "Opened" | "Claimed") {
  try {
    const updateData: any = { status }

    if (status === "Opened") {
      updateData.opened_at = new Date().toISOString()
    } else if (status === "Claimed") {
      updateData.claimed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("gift_cards")
      .update(updateData)
      .eq("unique_code", uniqueCode)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating gift card status:", error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error in updateGiftCardStatus:", error)
    return { error: error?.message || "Failed to update gift card status" }
  }
}
