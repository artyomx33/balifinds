'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { Text, Skeleton, Button } from '@/components/atoms'
import { NavBar, BottomNav, ShopSheet, ShopCard } from '@/components/organisms'
import { useShops, useGeolocation } from '@/lib/hooks'
import { calculateHaversineDistance } from '@/lib/utils/distance'

export default function NearbyPage() {
  const { data: shops, isLoading: shopsLoading } = useShops()
  const { latitude, longitude, error: geoError, isLoading: geoLoading, getCurrentPosition } = useGeolocation()
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null)

  // Request location on mount
  useEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  // Calculate distances and sort by nearest
  const sortedShops = useMemo(() => {
    if (!shops || shops.length === 0) return []

    // If no location, return unsorted
    if (!latitude || !longitude) {
      return shops.map(shop => ({ ...shop, distance: null }))
    }

    // Calculate distance for each shop and sort
    return shops
      .map(shop => ({
        ...shop,
        distance: calculateHaversineDistance(
          latitude,
          longitude,
          shop.latitude,
          shop.longitude
        )
      }))
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
  }, [shops, latitude, longitude])

  const hasLocation = latitude !== null && longitude !== null

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar showSearch={false} />

      <div className="pt-16 px-4">
        {/* Header */}
        <div className="pt-4 pb-2">
          <Text variant="h2">Nearby Shops</Text>
          {hasLocation ? (
            <Text variant="muted" className="mt-1">
              Sorted by distance from you
            </Text>
          ) : geoLoading ? (
            <Text variant="muted" className="mt-1">
              Getting your location...
            </Text>
          ) : geoError ? (
            <div className="mt-2 p-3 bg-charcoal-900 rounded-lg border border-charcoal-800">
              <Text variant="small" className="text-charcoal-300">
                📍 Location access needed to show distance
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentPosition}
                className="mt-2"
              >
                Enable Location
              </Button>
            </div>
          ) : (
            <Text variant="muted" className="mt-1">
              Enable location to sort by distance
            </Text>
          )}
        </div>

        {/* Shop Cards */}
        <div className="space-y-4 mt-4">
          {shopsLoading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-800">
                <Skeleton className="aspect-[16/9]" />
                <div className="grid grid-cols-3 gap-1 p-1 bg-charcoal-950">
                  {[0, 1, 2].map((j) => (
                    <Skeleton key={j} className="aspect-square rounded-md" />
                  ))}
                </div>
                <div className="px-3 py-2">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))
          ) : sortedShops.length > 0 ? (
            sortedShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                distance={shop.distance}
                onClick={() => setSelectedShopId(shop.id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Text variant="h3" className="text-charcoal-400">No shops found</Text>
              <Text variant="muted" className="mt-2">
                Be the first to add a shop!
              </Text>
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Shop Sheet */}
      <ShopSheet
        shopId={selectedShopId}
        onClose={() => setSelectedShopId(null)}
      />
    </div>
  )
}
