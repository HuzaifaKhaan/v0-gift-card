export const resendConfig = {
  from: process.env.RESEND_FROM_EMAIL || "LastMinuteCards <hello@lastminutecards.com>",
  replyTo: "support@lastminutecards.com",

  // Email best practices
  headers: {
    // Helps with email threading and tracking
    "X-Entity-Ref-ID": (id: string) => id,
    // Mark as important for better inbox placement
    "X-Priority": "1",
  },

  // Validate configuration
  isConfigured: () => {
    return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
  },

  // Get configuration status
  getStatus: () => {
    const hasApiKey = !!process.env.RESEND_API_KEY
    const hasFromEmail = !!process.env.RESEND_FROM_EMAIL

    return {
      configured: hasApiKey && hasFromEmail,
      apiKey: hasApiKey ? "✓ Set" : "✗ Missing",
      fromEmail: hasFromEmail ? process.env.RESEND_FROM_EMAIL : "✗ Missing",
    }
  },
}
