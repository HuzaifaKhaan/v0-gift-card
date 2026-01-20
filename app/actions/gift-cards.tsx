"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"
import { validateEmail, validateAmount, sanitizeMessage, sanitizeName, validateUniqueCode } from "@/lib/validation"

// Create Supabase client with server-side operations
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
  recipientEmail: string // Can be empty string
  amount: number
  message: string
  cardTemplate: string
  cardImageUrl: string
  uniqueCode: string
}) {
  try {
    if (!validateEmail(senderEmail)) {
      return { error: "Invalid sender email address" }
    }

    if (recipientEmail && !validateEmail(recipientEmail)) {
      return { error: "Invalid recipient email address" }
    }

    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) {
      return { error: amountValidation.error }
    }

    if (!validateUniqueCode(uniqueCode)) {
      return { error: "Invalid unique code format" }
    }

    const sanitizedSenderName = sanitizeName(senderName)
    const sanitizedRecipientName = sanitizeName(recipientName)
    const sanitizedMessage = sanitizeMessage(message)

    if (!sanitizedSenderName || !sanitizedRecipientName) {
      return { error: "Names cannot be empty" }
    }

    const invoiceNumber = generateInvoiceNumber()

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("gift_cards")
      .insert({
        sender_name: sanitizedSenderName,
        sender_email: senderEmail,
        recipient_name: sanitizedRecipientName,
        recipient_email: recipientEmail || "",
        amount: amount,
        message: sanitizedMessage,
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
      console.error("Supabase insert error:", error)
      return { error: error.message }
    }

    // Send notification email to support team
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "LastMinuteCards <hello@lastminutecards.com>"
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lastminutecards.vercel.app"
      
      await resend.emails.send({
        from: fromEmail,
        to: "support@lastminutecards.co.uk",
        subject: `New Gift Card Created - £${amount} - ${invoiceNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>New Gift Card Created</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h1 style="color: #185F72; margin-bottom: 24px; font-size: 24px;">New Gift Card Created</h1>
              
              <div style="background: #FFF7F5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #F6664C; margin: 0 0 16px 0; font-size: 18px;">Order Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Invoice Number:</td>
                    <td style="padding: 8px 0; color: #185F72; font-weight: 600; font-size: 14px;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Unique Code:</td>
                    <td style="padding: 8px 0; color: #185F72; font-weight: 600; font-size: 14px; font-family: monospace;">${uniqueCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount:</td>
                    <td style="padding: 8px 0; color: #F6664C; font-weight: 700; font-size: 18px;">£${amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Card Template:</td>
                    <td style="padding: 8px 0; color: #185F72; font-weight: 600; font-size: 14px;">${cardTemplate}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">Sender Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name:</td>
                    <td style="padding: 8px 0; color: #374151; font-weight: 600; font-size: 14px;">${sanitizedSenderName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; color: #374151; font-weight: 600; font-size: 14px;">${senderEmail}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">Recipient Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name:</td>
                    <td style="padding: 8px 0; color: #374151; font-weight: 600; font-size: 14px;">${sanitizedRecipientName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; color: #374151; font-weight: 600; font-size: 14px;">${recipientEmail || "Not provided"}</td>
                  </tr>
                </table>
              </div>
              
              ${sanitizedMessage ? `
              <div style="background: #fef3f2; border-left: 4px solid #F6664C; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">Personal Message:</p>
                <p style="color: #374151; font-size: 14px; margin: 0; font-style: italic;">"${sanitizedMessage}"</p>
              </div>
              ` : ""}
              
              <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <a href="${appUrl}/admin" style="display: inline-block; background: #F6664C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View in Admin Dashboard</a>
              </div>
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
                This is an automated notification from LastMinuteCards.<br>
                Created at: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}
              </p>
            </div>
          </body>
          </html>
        `,
        text: `
New Gift Card Created

Order Details:
- Invoice Number: ${invoiceNumber}
- Unique Code: ${uniqueCode}
- Amount: £${amount}
- Card Template: ${cardTemplate}

Sender Information:
- Name: ${sanitizedSenderName}
- Email: ${senderEmail}

Recipient Information:
- Name: ${sanitizedRecipientName}
- Email: ${recipientEmail || "Not provided"}

${sanitizedMessage ? `Personal Message: "${sanitizedMessage}"` : ""}

View in Admin Dashboard: ${appUrl}/admin

Created at: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}
        `.trim(),
      })
      console.log("Support notification email sent successfully")
    } catch (supportEmailError) {
      console.error("Failed to send support notification email:", supportEmailError)
      // Don't fail the whole operation if support email fails
    }

    if (recipientEmail && recipientEmail.trim() !== "") {
      try {
        if (!process.env.RESEND_API_KEY) {
          console.error("RESEND_API_KEY not configured")
          throw new Error("Email service not configured")
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || "LastMinuteCards <hello@lastminutecards.com>"
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lastminutecards.vercel.app"
        const encodedToken = await encodeGiftCode(uniqueCode)
        const viewLink = `${appUrl}/claim?token=${encodedToken}`

        console.log("Sending email to:", recipientEmail)
        console.log("From:", fromEmail)
        console.log("Secure view link:", viewLink)

        const emailResult = await resend.emails.send({
          from: fromEmail,
          replyTo: senderEmail || "support@lastminutecards.com",
          to: recipientEmail,
          subject: `${sanitizedSenderName} sent you a ${amount > 0 ? `£${amount} ` : ""}gift card`,
          headers: {
            "X-Entity-Ref-ID": uniqueCode,
            "X-Priority": "1",
          },
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>You've received a gift card</title>
            <!--[if mso]>
            <style>
              table { border-collapse: collapse; }
              .button { padding: 16px 32px !important; }
            </style>
            <![endif]-->
          </head>
          <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 32px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                        <h1 style="color: #F6664C; font-size: 28px; margin: 0 0 8px 0; font-weight: 700; line-height: 1.2;">You've received a gift</h1>
                        <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">${sanitizedSenderName} has sent you something special</p>
                      </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 32px 40px;">
                        <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">Hello ${sanitizedRecipientName},</p>
                        <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">You have received a digital gift card${amount > 0 ? ` worth £${amount}` : ""}. Click the button below to view your personalized card:</p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
                          <tr>
                            <td align="center">
                              <!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${viewLink}" style="height:52px;v-text-anchor:middle;width:200px;" arcsize="15%" stroke="f" fillcolor="#F6664C">
                                <w:anchorlock/>
                                <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">View Your Gift Card</center>
                              </v:roundrect>
                              <![endif]-->
                              <!--[if !mso]><!-->
                              <a href="${viewLink}" style="display: inline-block; background-color: #F6664C; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; line-height: 1.5; mso-hide: all;">View Your Gift Card</a>
                              <!--<![endif]-->
                            </td>
                          </tr>
                        </table>
                        
                        ${
                          sanitizedMessage
                            ? `
                        <!-- Personal Message -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fef3f2; border-left: 4px solid #F6664C; border-radius: 4px; margin-top: 24px;">
                          <tr>
                            <td style="padding: 16px 20px;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Personal message from ${sanitizedSenderName}:</p>
                              <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.6; font-style: italic;">"${sanitizedMessage}"</p>
                            </td>
                          </tr>
                        </table>
                        `
                            : ""
                        }
                        
                        <!-- Unique Code Box -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; border-radius: 8px; margin-top: 24px;">
                          <tr>
                            <td style="padding: 16px 20px;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Your unique code:</p>
                              <p style="color: #374151; font-size: 24px; font-weight: 700; font-family: 'Courier New', Courier, monospace; margin: 0; letter-spacing: 2px;">${uniqueCode}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0 0; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${viewLink}" style="color: #F6664C; word-break: break-all; text-decoration: underline;">${viewLink}</a></p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 24px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; text-align: center; line-height: 1.5;">This email was sent because ${sanitizedSenderName} (${senderEmail || "sender"}) sent you a gift card from LastMinuteCards.</p>
                        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">© ${new Date().getFullYear()} LastMinuteCards. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Spacer for email clients -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px;">
                    <tr>
                      <td style="padding: 20px; text-align: center;">
                        <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                          <a href="${appUrl}" style="color: #9ca3af; text-decoration: underline;">Visit LastMinuteCards</a>
                        </p>
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
Hello ${sanitizedRecipientName},

${sanitizedSenderName} has sent you a gift card${amount > 0 ? ` worth £${amount}` : ""}!

${sanitizedMessage ? `Personal message: "${sanitizedMessage}"` : ""}

View your gift card here: ${viewLink}

Your unique code: ${uniqueCode}

If you have any questions, please reply to this email or contact us at support@lastminutecards.com

© ${new Date().getFullYear()} LastMinuteCards. All rights reserved.
        `.trim(),
        })

        console.log("Email sent successfully!")
        console.log("Email ID:", emailResult.data?.id)

        if (emailResult.data?.id) {
          await supabase
            .from("gift_cards")
            .update({
              email_sent: true,
              email_id: emailResult.data.id,
            })
            .eq("id", data.id)
        }
      } catch (emailError: any) {
        console.error("Email send error:", emailError)
        console.error("Error details:", JSON.stringify(emailError, null, 2))

        await supabase
          .from("gift_cards")
          .update({
            email_sent: false,
            email_error: emailError?.message || "Failed to send email",
          })
          .eq("id", data.id)
      }
    } else {
      console.log("No recipient email provided, skipping email send")
      await supabase
        .from("gift_cards")
        .update({
          email_sent: false,
          email_error: "No recipient email provided",
        })
        .eq("id", data.id)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error creating gift card:", error)
    return { error: error?.message || "Failed to create gift card" }
  }
}

export async function getGiftCardByCode(uniqueCode: string) {
  try {
    if (!validateUniqueCode(uniqueCode)) {
      return { data: null, error: "Invalid code format" }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("gift_cards").select("*").eq("unique_code", uniqueCode).single()

    if (error) {
      console.error("Supabase error fetching gift card:", error)
      // Return a structured error response
      return { data: null, error: error.message || "Gift card not found" }
    }

    if (!data) {
      console.error("No data returned for gift card")
      return { data: null, error: "Gift card not found" }
    }

    console.log("Gift card fetched successfully")
    return { data, error: null }
  } catch (error: any) {
    // Handle unexpected errors (like rate limiting, network issues, etc.)
    console.error("Unexpected error in getGiftCardByCode:", error)
    const errorMessage = typeof error === "string" ? error : error?.message || "Failed to fetch gift card"
    return { data: null, error: errorMessage }
  }
}

export async function updateGiftCardStatus(uniqueCode: string, status: "Sent" | "Opened" | "Claimed") {
  try {
    if (!validateUniqueCode(uniqueCode)) {
      return { error: "Invalid code format" }
    }

    const updateData: any = { status }

    if (status === "Opened") {
      updateData.opened_at = new Date().toISOString()
    } else if (status === "Claimed") {
      updateData.claimed_at = new Date().toISOString()
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("gift_cards")
      .update(updateData)
      .eq("unique_code", uniqueCode)
      .select()
      .single()

    if (error) {
      console.error("Error updating gift card status:", error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in updateGiftCardStatus:", error)
    return { error: error?.message || "Failed to update gift card status" }
  }
}

export async function encodeGiftCode(uniqueCode: string): Promise<string> {
  // Use base64 encoding to hide the code in URL
  const base64 = btoa(uniqueCode)
  // Make it URL safe
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export async function decodeGiftCode(encodedCode: string): Promise<string> {
  try {
    // Reverse URL safe encoding
    const base64 = encodedCode.replace(/-/g, "+").replace(/_/g, "/")
    // Add padding if needed
    const padded = base64 + "==".substring(0, (4 - (base64.length % 4)) % 4)
    const decoded = atob(padded)
    return decoded
  } catch (error) {
    console.error("Error decoding gift code:", error)
    throw new Error("Invalid gift code")
  }
}
