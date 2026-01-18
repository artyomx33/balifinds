'use client'

export const dynamic = 'force-dynamic'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { useRegion } from '@/lib/hooks'

interface ShopPageProps {
  params: Promise<{ id: string; region: string }>
}

export default function ShopPage({ params }: ShopPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { region } = useRegion()
  const setSelectedShopId = useAppStore((state) => state.setSelectedShopId)

  useEffect(() => {
    // Set the shop ID and redirect to map
    setSelectedShopId(id)
    router.replace(`/${region}/map`)
  }, [id, router, region, setSelectedShopId])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  )
}
