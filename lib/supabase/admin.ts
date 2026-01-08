"use server"

import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function getAdminClient() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("[v0] getAdminClient - User:", user?.email, "Role:", user?.user_metadata?.role)

  if (error || !user) {
    console.error("[v0] getAdminClient - Auth error:", error)
    throw new Error("Unauthorized: Admin authentication required")
  }

  if (user.user_metadata?.role !== "admin") {
    console.error("[v0] getAdminClient - User is not admin:", user.email)
    throw new Error("Unauthorized: Admin role required")
  }

  // Return service role client ONLY after verifying admin auth
  const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  return { adminClient, userId: user.id, userEmail: user.email }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] isAdminAuthenticated - User:", user?.email, "Role:", user?.user_metadata?.role)

    const isAdmin = !!user && user.user_metadata?.role === "admin"
    console.log("[v0] isAdminAuthenticated - Result:", isAdmin)

    return isAdmin
  } catch (error) {
    console.error("[v0] isAdminAuthenticated - Error:", error)
    return false
  }
}
