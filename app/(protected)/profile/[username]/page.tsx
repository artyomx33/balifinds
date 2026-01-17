'use client'

export const dynamic = 'force-dynamic'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavBar, BottomNav } from '@/components/organisms'
import { Avatar, Text, Button, Skeleton } from '@/components/atoms'
import { StatCard } from '@/components/molecules'
import { getSupabaseClient } from '@/lib/supabase'
import { useAccess } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)
  const router = useRouter()
  const { user: currentUser } = useAccess()
  const supabase = getSupabaseClient()

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      if (!supabase) return null
      const { data, error } = await (supabase.from('bali_users') as any)
        .select('*')
        .eq('username', username)
        .single()
      if (error) throw error
      return data as { id: string; username: string; email: string; avatar_url: string | null; created_at: string }
    },
  })

  // Fetch user's shops
  const { data: shops, isLoading: shopsLoading } = useQuery({
    queryKey: ['user-shops', username],
    queryFn: async () => {
      if (!supabase || !profile) return []
      const { data, error } = await (supabase.from('bali_shops') as any)
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Array<{ id: string; photo_url: string; item_count: number; upvote_count: number }>
    },
    enabled: !!profile,
  })

  // Calculate stats
  const stats = {
    shopCount: shops?.length || 0,
    itemCount: shops?.reduce((acc, s) => acc + (s.item_count || 0), 0) || 0,
    totalUpvotes: shops?.reduce((acc, s) => acc + (s.upvote_count || 0), 0) || 0,
  }

  const isOwnProfile = currentUser?.username === username

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/map')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <NavBar showSearch={false} />

      <div className="pt-16 px-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-6">
          {profileLoading ? (
            <>
              <Skeleton variant="circular" className="w-20 h-20" />
              <Skeleton className="w-32 h-6 mt-3" />
              <Skeleton className="w-24 h-4 mt-1" />
            </>
          ) : profile ? (
            <>
              <Avatar
                src={profile.avatar_url}
                fallback={profile.username[0]?.toUpperCase()}
                size="lg"
                className="w-20 h-20"
              />
              <Text variant="h2" className="mt-3">@{profile.username}</Text>
              <Text variant="muted">
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Text>
            </>
          ) : (
            <Text variant="muted">User not found</Text>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <StatCard value={stats.shopCount} label="Shops" />
          <StatCard value={stats.itemCount} label="Items" />
          <StatCard value={stats.totalUpvotes} label="Upvotes" />
        </div>

        {/* My Contributions */}
        <div className="mt-8">
          <Text variant="h3" className="mb-4">
            {isOwnProfile ? 'My Contributions' : 'Contributions'}
          </Text>

          {shopsLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          ) : shops && shops.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {shops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => router.push(`/shop/${shop.id}`)}
                  className="relative aspect-square rounded-md overflow-hidden group"
                >
                  <img
                    src={shop.photo_url}
                    alt="Shop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-xs text-gold">
                    {shop.upvote_count}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <Text variant="muted" className="text-center py-8">
              No contributions yet
            </Text>
          )}
        </div>

        {/* Settings (only for own profile) */}
        {isOwnProfile && (
          <div className="mt-8 space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {/* TODO: Settings */}}
            >
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
