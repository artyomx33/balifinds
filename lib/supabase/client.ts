import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    return null
  }
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type TypedSupabaseClient = NonNullable<ReturnType<typeof createClient>>

// Singleton for client-side usage
let client: TypedSupabaseClient | null = null

export const getSupabaseClient = (): TypedSupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null
  }
  if (!client) {
    client = createClient()
  }
  return client
}
