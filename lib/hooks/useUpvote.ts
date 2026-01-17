'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type UpvotesRow = Database['public']['Tables']['upvotes']['Row']
type UpvotesInsert = Database['public']['Tables']['upvotes']['Insert']

export const useToggleUpvote = () => {
  const supabase = getSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (shopId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be logged in to upvote')

      // Check if already upvoted
      const { data: existing } = await supabase
        .from('upvotes')
        .select()
        .eq('shop_id', shopId)
        .eq('user_id', user.id)
        .single() as { data: UpvotesRow | null }

      if (existing) {
        // Remove upvote
        await supabase.from('upvotes').delete().eq('id', existing.id)
        return { action: 'removed' as const }
      } else {
        // Add upvote
        const upvoteInsert: UpvotesInsert = {
          shop_id: shopId,
          user_id: user.id,
        }
        await supabase.from('upvotes').insert(upvoteInsert as never)
        return { action: 'added' as const }
      }
    },
    onSuccess: (_, shopId) => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] })
    },
  })
}
