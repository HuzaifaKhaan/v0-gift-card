export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== "number" || isNaN(amount)) {
    return { valid: false, error: "Amount must be a number" }
  }
  if (amount < 0) {
    return { valid: false, error: "Amount cannot be negative" }
  }
  if (amount > 10000) {
    return { valid: false, error: "Amount cannot exceed £10,000" }
  }
  if (amount > 0 && amount < 1) {
    return { valid: false, error: "Minimum amount is £1" }
  }
  return { valid: true }
}

export function validateUKSortCode(sortCode: string): boolean {
  // Remove any spaces or dashes
  const cleaned = sortCode.replace(/[\s-]/g, "")
  // Must be exactly 6 digits
  return /^\d{6}$/.test(cleaned)
}

export function validateUKAccountNumber(accountNumber: string): boolean {
  // Remove any spaces
  const cleaned = accountNumber.replace(/\s/g, "")
  // Must be exactly 8 digits
  return /^\d{8}$/.test(cleaned)
}

export function sanitizeMessage(message: string): string {
  // Trim and limit length
  let sanitized = message.trim().substring(0, 1000)

  // Basic XSS prevention - escape HTML
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  return sanitized
}

export function sanitizeName(name: string): string {
  // Trim and limit length
  return name.trim().substring(0, 100)
}

export function validateUniqueCode(code: string): boolean {
  // Codes should be alphanumeric, 8-16 characters
  return /^[A-Z0-9]{8,16}$/.test(code)
}
