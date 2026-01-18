'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavBar, BottomNav } from '@/components/organisms'
import { Avatar, Text, Skeleton } from '@/components/atoms'
import { getSupabaseClient } from '@/lib/supabase'
import { cn } from '@/lib/utils/cn'

type Period = 'month' | 'all'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('month')
  const supabase = getSupabaseClient()

  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: async () => {
      if (!supabase) return []
      let query = (supabase.from('shops') as any)
        .select(`
          user_id,
          users!inner(username, avatar_url)
        `)

      if (period === 'month') {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        query = query.gte('created_at', startOfMonth.toISOString())
      }

      const { data, error } = await query
      if (error) throw error

      // Aggregate by user
      const userMap = new Map<string, {
        userId: string
        username: string
        avatarUrl: string | null
        shopCount: number
      }>()

      data?.forEach((shop: any) => {
        const userId = shop.user_id
        if (!userId) return

        const existing = userMap.get(userId)
        if (existing) {
          existing.shopCount++
        } else {
          userMap.set(userId, {
            userId,
            username: shop.users?.username || 'Unknown',
            avatarUrl: shop.users?.avatar_url || null,
            shopCount: 1,
          })
        }
      })

      // Sort by shop count and get top 10
      return Array.from(userMap.values())
        .sort((a, b) => b.shopCount - a.shopCount)
        .slice(0, 10)
        .map((user, index) => ({ ...user, rank: index + 1 }))
    },
  })

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1: return '1st'
      case 2: return '2nd'
      case 3: return '3rd'
      default: return rank.toString()
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <NavBar showSearch={false} />

      <div className="pt-16 px-4">
        <Text variant="h1" className="pt-6 flex items-center gap-2">
          Top Contributors
        </Text>

        {/* Period Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setPeriod('month')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              period === 'month'
                ? 'bg-gold text-black'
                : 'bg-charcoal-900 text-charcoal-100 border border-charcoal-700'
            )}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              period === 'all'
                ? 'bg-gold text-black'
                : 'bg-charcoal-900 text-charcoal-100 border border-charcoal-700'
            )}
          >
            All Time
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="mt-6 space-y-2">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-charcoal-900 rounded-lg">
                <Skeleton className="w-8 h-8" />
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
            ))
          ) : leaders && leaders.length > 0 ? (
            leaders.map((leader) => (
              <div
                key={leader.userId}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  leader.rank <= 3 ? 'bg-charcoal-900 border border-gold-500/30' : 'bg-charcoal-900'
                )}
              >
                {/* Rank */}
                <div className={cn(
                  'w-8 h-8 flex items-center justify-center font-bold',
                  leader.rank <= 3 ? 'text-gold-400 text-lg' : 'text-charcoal-400'
                )}>
                  {getMedal(leader.rank)}
                </div>

                {/* Avatar */}
                <Avatar
                  src={leader.avatarUrl}
                  fallback={leader.username[0]?.toUpperCase()}
                  size="md"
                />

                {/* Info */}
                <div className="flex-1">
                  <Text variant="body" className="font-medium">
                    @{leader.username}
                  </Text>
                  <Text variant="muted" className="text-xs">
                    {leader.shopCount} shops
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <Text variant="muted" className="text-center py-8">
              No contributors yet this period
            </Text>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
