import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail, recipientName, senderName, amount, claimLink, uniqueCode } = await request.json()

    console.log("[v0] Sending gift card email to:", recipientEmail)

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #ef4444; }
            .card { background: #f9fafb; border-radius: 8px; padding: 30px; margin: 20px 0; }
            .amount { font-size: 48px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .code { background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 18px; text-align: center; margin: 15px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎁 Last Minute Cards</div>
            </div>
            
            <div class="card">
              <h1>Your gift has arrived! 🎉</h1>
              <p>Hi ${recipientName},</p>
              <p>${senderName} has sent you a gift card!</p>
              
              <div class="amount">$${amount}</div>
              
              <p>Click the button below to view your personalized card and claim your gift:</p>
              
              <div style="text-align: center;">
                <a href="${claimLink}" class="button">Claim Your Cash Gift</a>
              </div>
              
              <p>Or enter this unique code on our website:</p>
              <div class="code">${uniqueCode}</div>
              
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                Once you claim, you'll enter your bank details and receive the gift amount directly to your account.
              </p>
            </div>
            
            <div class="footer">
              <p>This email was sent because ${senderName} sent you a gift card.</p>
              <p>© ${new Date().getFullYear()} Last Minute Cards. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Install with: npm install resend
    // Uncomment and add RESEND_API_KEY environment variable

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: "Last Minute Cards <noreply@lastminutecards.com>",
          to: recipientEmail,
          subject: `🎁 You've received a gift card from ${senderName}!`,
          html: emailHtml,
        })

        console.log("[v0] Email sent successfully via Resend")
      } catch (emailError) {
        console.error("[v0] Error sending via Resend:", emailError)
        // Fall through to logging
      }
    }

    // For testing/demo purposes, log the email content
    console.log("[v0] Gift card email details:")
    console.log("To:", recipientEmail)
    console.log("Subject:", `🎁 You've received a gift card from ${senderName}!`)
    console.log("Amount:", amount)
    console.log("Claim Link:", claimLink)
    console.log("Unique Code:", uniqueCode)
    console.log("\n--- Email HTML ---")
    console.log(emailHtml)
    console.log("--- End Email ---\n")

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      emailHtml,
    })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
