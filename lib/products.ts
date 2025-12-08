export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  cardId?: string
  recipientName?: string
  recipientEmail?: string
  message?: string
}

// Product catalog for cash gift amounts
export const CASH_AMOUNTS = [
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
  { value: 250, label: "$250" },
  { value: 500, label: "$500" },
]
