// Validation utilities for input sanitization and validation

/**
 * Validates email format
 * Allows empty strings for optional email fields
 */
export function validateEmail(email: string): boolean {
  if (email === "") return true // Allow empty for optional fields
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validates UK sort code format (XX-XX-XX or XXXXXX)
 */
export function validateUKSortCode(sortCode: string): boolean {
  // Remove any spaces or hyphens
  const cleaned = sortCode.replace(/[\s-]/g, "")
  // Must be exactly 6 digits
  return /^\d{6}$/.test(cleaned)
}

/**
 * Validates UK bank account number (8 digits)
 */
export function validateUKAccountNumber(accountNumber: string): boolean {
  // Remove any spaces
  const cleaned = accountNumber.replace(/\s/g, "")
  // Must be exactly 8 digits
  return /^\d{8}$/.test(cleaned)
}

/**
 * Validates amount is positive and within reasonable limits
 */
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return { valid: false, error: "Amount must be a valid number" }
  }

  if (amount < 0) {
    return { valid: false, error: "Amount cannot be negative" }
  }

  if (amount > 10000) {
    return { valid: false, error: "Amount cannot exceed £10,000" }
  }

  // Check for reasonable decimal places (max 2)
  if (amount.toString().split(".")[1]?.length > 2) {
    return { valid: false, error: "Amount cannot have more than 2 decimal places" }
  }

  return { valid: true }
}

/**
 * Validates unique code format
 */
export function validateUniqueCode(code: string): boolean {
  if (!code || typeof code !== "string") return false
  // Allow alphanumeric codes with hyphens, 8-32 characters
  return /^[A-Za-z0-9-]{8,32}$/.test(code)
}

/**
 * Sanitizes message to prevent XSS
 */
export function sanitizeMessage(message: string): string {
  if (!message) return ""

  // Remove any HTML tags
  let sanitized = message.replace(/<[^>]*>/g, "")

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")

  // Limit length
  return sanitized.slice(0, 500)
}

/**
 * Sanitizes name fields
 */
export function sanitizeName(name: string): string {
  if (!name) return ""

  // Remove any HTML tags
  let sanitized = name.replace(/<[^>]*>/g, "")

  // Remove special characters except spaces, hyphens, apostrophes, and common accents
  sanitized = sanitized.replace(
    /[^a-zA-Z0-9\s\-'àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]/g,
    "",
  )

  // Trim and limit length
  return sanitized.trim().slice(0, 100)
}

/**
 * Validates and formats UK sort code to XX-XX-XX format
 */
export function formatUKSortCode(sortCode: string): string {
  const cleaned = sortCode.replace(/[\s-]/g, "")
  if (!/^\d{6}$/.test(cleaned)) return sortCode
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`
}

/**
 * Validates phone number (basic international format)
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false
  // Allow + and digits, 10-15 characters
  const cleaned = phone.replace(/[\s()-]/g, "")
  return /^\+?\d{10,15}$/.test(cleaned)
}
