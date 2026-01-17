'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'
import type { ShopFilters, ShopCategory } from '@/types'

// Explicit types for Supabase data
interface ShopRow {
  id: string
  photo_url: string
  latitude: number
  longitude: number
  category: string
  upvote_count: number
  item_count: number
  avg_price_millions: number | null
  min_price_millions: number | null
  max_price_millions: number | null
  created_at: string
  user_id: string | null
  users?: { username: string; avatar_url: string | null } | null
  items?: Array<{ id: string; photo_url: string; price_millions: number }>
}

export const useShops = (filters?: ShopFilters) => {
  const supabase = getSupabaseClient()

  return useQuery({
    queryKey: ['shops', filters],
    queryFn: async () => {
      if (!supabase) return []
      let query = (supabase.from('shops') as any)
        .select(`
          id,
          photo_url,
          latitude,
          longitude,
          category,
          upvote_count,
          item_count,
          avg_price_millions,
          min_price_millions,
          max_price_millions,
          created_at,
          users!left(username, avatar_url)
        `)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('avg_price_millions', filters.minPrice)
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('avg_price_millions', filters.maxPrice)
      }

      const { data, error } = await query

      if (error) throw error
      return data as ShopRow[]
    },
  })
}

export const useShopDetail = (shopId: string) => {
  const supabase = getSupabaseClient()

  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => {
      if (!supabase) return null
      const { data, error } = await (supabase.from('shops') as any)
        .select(`
          *,
          users!left(username, avatar_url),
          items(id, photo_url, price_millions)
        `)
        .eq('id', shopId)
        .single()

      if (error) throw error
      return data as ShopRow
    },
    enabled: !!shopId,
  })
}

export const useCreateShop = () => {
  const supabase = getSupabaseClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      photoUrl: string
      latitude: number
      longitude: number
      category: ShopCategory
      locationVerified: boolean
      items: { photoUrl: string; priceMillions: number }[]
    }) => {
      if (!supabase) throw new Error('Supabase not configured')
      // Get current user (optional)
      const { data: { user } } = await supabase.auth.getUser()

      // Create shop
      const { data: shop, error: shopError } = await (supabase.from('shops') as any)
        .insert({
          user_id: user?.id || null,
          photo_url: data.photoUrl,
          latitude: data.latitude,
          longitude: data.longitude,
          category: data.category,
          location_verified: data.locationVerified,
        })
        .select()
        .single()

      if (shopError) throw shopError

      // Create items
      if (data.items.length > 0) {
        const { error: itemsError } = await (supabase.from('items') as any)
          .insert(
            data.items.map(item => ({
              shop_id: shop.id,
              photo_url: item.photoUrl,
              price_millions: item.priceMillions,
            }))
          )

        if (itemsError) throw itemsError
      }

      return shop as ShopRow
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    },
  })
}
