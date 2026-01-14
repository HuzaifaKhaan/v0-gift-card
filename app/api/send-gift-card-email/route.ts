import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

async function encodeGiftCode(uniqueCode: string): Promise<string> {
  const base64 = btoa(uniqueCode)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail, recipientName, senderName, amount, claimLink, uniqueCode, message } = await request.json()

    console.log("[v0] Sending gift card email to:", recipientEmail)

    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY not configured")
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "LastMinuteCards <hello@lastminutecards.com>"
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lastminutecards.vercel.app"

    const encodedToken = await encodeGiftCode(uniqueCode)
    const secureClaimLink = `${appUrl}/claim?token=${encodedToken}`

    console.log("[v0] Sending from:", fromEmail)
    console.log("[v0] Secure claim link:", secureClaimLink)

    const emailHtml = `
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
                    <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">${senderName} has sent you something special</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 32px 40px;">
                    <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">Hello ${recipientName},</p>
                    <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">You have received a digital gift card worth £${amount}. Click the button below to view your personalized card and claim your reward:</p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0;">
                      <tr>
                        <td align="center">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${secureClaimLink}" style="height:52px;v-text-anchor:middle;width:240px;" arcsize="15%" stroke="f" fillcolor="#F6664C">
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">Claim Your Cash Gift</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a href="${secureClaimLink}" style="display: inline-block; background-color: #F6664C; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; line-height: 1.5; mso-hide: all;">Claim Your Cash Gift</a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                    
                    ${
                      message
                        ? `
                    <!-- Personal Message -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fef3f2; border-left: 4px solid #F6664C; border-radius: 4px; margin-top: 24px;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Personal message from ${senderName}:</p>
                          <p style="color: #374151; font-size: 15px; margin: 0; line-height: 1.6; font-style: italic;">"${message}"</p>
                        </td>
                      </tr>
                    </table>
                    `
                        : ""
                    }
                    
                    <!-- Unique Code Box - Only show code, not in URL -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; border-radius: 8px; margin-top: 24px;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Your unique code (for verification):</p>
                          <p style="color: #374151; font-size: 24px; font-weight: 700; font-family: 'Courier New', Courier, monospace; margin: 0; letter-spacing: 2px;">${uniqueCode}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0 0; line-height: 1.5;">
                      Once you claim, you'll enter your bank details and receive the gift amount directly to your account within 1-2 business days.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0 0; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${secureClaimLink}" style="color: #F6664C; word-break: break-all; text-decoration: underline;">${secureClaimLink}</a></p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; text-align: center; line-height: 1.5;">This email was sent because ${senderName} sent you a gift card from LastMinuteCards.</p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">© ${new Date().getFullYear()} LastMinuteCards. All rights reserved.</p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer Link -->
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
    `

    const emailText = `
Hello ${recipientName},

${senderName} has sent you a gift card worth £${amount}!

${message ? `Personal message: "${message}"` : ""}

Claim your gift here: ${secureClaimLink}

Your unique code (for verification): ${uniqueCode}

Once you claim, you'll enter your bank details and receive the gift amount directly to your account within 1-2 business days.

If you have any questions, please contact us at support@lastminutecards.com

© ${new Date().getFullYear()} LastMinuteCards. All rights reserved.
    `.trim()

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)

      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: `🎁 You've received a £${amount} gift from ${senderName}!`,
        html: emailHtml,
        text: emailText,
        headers: {
          "X-Entity-Ref-ID": uniqueCode,
          "X-Priority": "1",
        },
      })

      console.log("[v0] Email sent successfully via Resend")
      console.log("[v0] Email ID:", emailResult.data?.id)

      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        emailId: emailResult.data?.id,
      })
    } catch (emailError: any) {
      console.error("[v0] Error sending via Resend:", emailError)
      console.error("[v0] Error details:", JSON.stringify(emailError, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: emailError.message || "Failed to send email",
          details: emailError.response?.body || emailError,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("[v0] Error processing email request:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to send email" }, { status: 500 })
  }
}
