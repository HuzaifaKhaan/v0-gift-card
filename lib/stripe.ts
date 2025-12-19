import "server-only"

import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

if (!stripeSecretKey.startsWith("sk_test_") && !stripeSecretKey.startsWith("sk_live_")) {
  throw new Error("Invalid STRIPE_SECRET_KEY format. Must start with sk_test_ or sk_live_")
}

const keyType = stripeSecretKey.startsWith("sk_test_") ? "TEST" : "LIVE"
console.log(`[v0] Stripe initialized in ${keyType} mode`)

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})
