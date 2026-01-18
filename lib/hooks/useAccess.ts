'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import type { AccessState, User } from '@/types'
import type { Tables } from '@/types/database'
import type { User as AuthUser, AuthChangeEvent, Session } from '@supabase/supabase-js'

const CONTRIBUTION_KEY = 'cityfinds_contributed'

export const useAccess = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasContributed, setHasContributed] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Check localStorage for contribution flag
    const contributed = localStorage.getItem(CONTRIBUTION_KEY) === 'true'
    setHasContributed(contributed)

    // If Supabase not configured, just use local storage mode
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Check auth state
    supabase.auth.getUser().then(({ data: { user: authUser } }: { data: { user: AuthUser | null } }) => {
      if (authUser) {
        // Fetch full user profile
        (supabase.from('users') as any)
          .select('*')
          .eq('id', authUser.id)
          .single()
          .then(({ data }: { data: Tables<'users'> | null }) => {
            if (data) {
              setUser({
                id: data.id,
                email: data.email,
                username: data.username,
                avatarUrl: data.avatar_url,
                preferredCurrency: data.preferred_currency,
                createdAt: new Date(data.created_at),
              })
            }
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, _session: Session | null) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const markContributed = useCallback(() => {
    localStorage.setItem(CONTRIBUTION_KEY, 'true')
    setHasContributed(true)
  }, [])

  const accessState: AccessState = {
    isLoggedIn: !!user,
    hasContributed,
  }

  const canViewPrices = accessState.isLoggedIn || accessState.hasContributed
  const canViewItems = accessState.isLoggedIn || accessState.hasContributed

  return {
    user,
    isLoading,
    accessState,
    canViewPrices,
    canViewItems,
    markContributed,
  }
}
