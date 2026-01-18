'use client'

export const dynamic = 'force-dynamic'

import { NavBar, BottomNav, FAB, CategoryFilter, PriceFilter, MapView, ShopSheet } from '@/components/organisms'
import { useAppStore } from '@/store'
import { useRegion } from '@/lib/hooks'

export default function MapPage() {
  const { selectedShopId, setSelectedShopId } = useAppStore()
  const { region, config } = useRegion()

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top Navigation */}
      <NavBar region={region} />

      {/* Filters - below navbar */}
      <div className="fixed top-14 left-0 right-0 z-30 py-2 space-y-2 glass">
        <CategoryFilter />
        <PriceFilter />
      </div>

      {/* Map - full screen behind everything */}
      <div className="flex-1 pt-28 pb-16">
        <MapView
          className="h-full"
          region={region}
          onShopClick={(id) => setSelectedShopId(id)}
        />
      </div>

      {/* Floating Action Button */}
      <FAB region={region} />

      {/* Bottom Navigation */}
      <BottomNav region={region} />

      {/* Shop Bottom Sheet */}
      <ShopSheet
        shopId={selectedShopId}
        onClose={() => setSelectedShopId(null)}
        region={region}
      />
    </div>
  )
}
