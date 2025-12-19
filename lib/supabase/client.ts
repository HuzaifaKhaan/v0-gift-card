import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

export function createClient() {
  // Return existing instance if available
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  // Create new instance only if none exists
  client = createSupabaseClient(supabaseUrl, supabaseKey)

  return client
}
