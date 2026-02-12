import type React from "react"
import { Ubuntu } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
})

export const metadata = {
  title: "Last Minute Cards - Digital Gift Cards with Cash Gifts",
  description:
    "Send personalized digital greeting cards with optional cash gifts instantly. Perfect for birthdays, anniversaries, and special occasions.",
  icons: {
    icon: [
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/logo.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_ubuntu.variable}`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
