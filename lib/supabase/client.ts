import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type TypedSupabaseClient = ReturnType<typeof createClient>

// Singleton for client-side usage
let client: TypedSupabaseClient | null = null

export const getSupabaseClient = (): TypedSupabaseClient => {
  if (!client) {
    client = createClient()
  }
  return client
}
