import { createBrowserClient } from "@supabase/ssr"

/**
 * Create a Supabase client with proper error handling for missing env vars
 * This wrapper ensures environment variables are available before creating the client
 */
export function createClientSafe() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables not configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.",
    )
  }

  
  return createBrowserClient(url, anonKey)
}

/**
 * Check if Supabase environment variables are available
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
