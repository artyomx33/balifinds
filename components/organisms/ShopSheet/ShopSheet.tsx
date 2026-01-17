'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Spinner, Skeleton, Badge, Text } from '@/components/atoms'
import { PriceTag, UserBadge, UpvoteButton } from '@/components/molecules'
import { useShopDetail, useAccess, useCurrency, useToggleUpvote } from '@/lib/hooks'
import { useAppStore } from '@/store'
import { CATEGORIES } from '@/types'
import { formatPriceRange } from '@/lib/utils/price'
import { cn } from '@/lib/utils/cn'

export interface ShopSheetProps {
  shopId: string | null
  onClose: () => void
}

export const ShopSheet = ({ shopId, onClose }: ShopSheetProps) => {
  const router = useRouter()
  const { data: shop, isLoading } = useShopDetail(shopId || '')
  const { canViewPrices, canViewItems, user } = useAccess()
  const { currency } = useCurrency()
  const toggleUpvote = useToggleUpvote()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (shopId) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [shopId])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300) // Wait for animation
  }

  const handleUpvote = () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (shopId) {
      toggleUpvote.mutate(shopId)
    }
  }

  const handleDirections = () => {
    if (shop) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`
      window.open(url, '_blank')
    }
  }

  const categoryInfo = shop ? CATEGORIES[shop.category as keyof typeof CATEGORIES] : null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-darker rounded-t-2xl',
          'transition-transform duration-300 ease-out',
          'max-h-[80vh] overflow-y-auto',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-medium rounded-full" />
        </div>

        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="w-full h-48 rounded-lg" />
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-48 h-4" />
          </div>
        ) : shop ? (
          <div className="pb-6">
            {/* Shop Photo */}
            <div className="px-4">
              <img
                src={shop.photo_url}
                alt="Shop"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Category Badge */}
            {categoryInfo && (
              <div className="px-4 mt-3">
                <Badge variant="category" color={categoryInfo.color}>
                  {categoryInfo.icon} {categoryInfo.label}
                </Badge>
              </div>
            )}

            {/* Price Range */}
            <div className="px-4 mt-3">
              {canViewPrices ? (
                <Text variant="body" className="text-gold">
                  {formatPriceRange(shop.min_price_millions, shop.max_price_millions, currency)}
                </Text>
              ) : (
                <div className="flex items-center gap-2 text-muted">
                  <span>🔒</span>
                  <span className="text-sm">Login or contribute to see prices</span>
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="px-4 mt-2 flex items-center gap-3 text-sm text-muted">
              {shop.users && (
                <UserBadge
                  username={shop.users.username}
                  avatarUrl={shop.users.avatar_url}
                  size="sm"
                />
              )}
              <span>•</span>
              <span>{shop.item_count} items</span>
              <span>•</span>
              <span>👍 {shop.upvote_count}</span>
            </div>

            {/* Items Grid */}
            <div className="px-4 mt-4">
              <Text variant="small" className="text-muted mb-2">Items</Text>
              {canViewItems && shop.items && shop.items.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {shop.items.map((item) => (
                    <div key={item.id} className="relative">
                      <img
                        src={item.photo_url}
                        alt="Item"
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      <div className="absolute bottom-1 left-1 right-1">
                        <PriceTag
                          priceMillions={item.price_millions}
                          currency={currency}
                          size="sm"
                          className="bg-black/70 px-1 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !canViewItems ? (
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full aspect-square bg-dark rounded-md flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                  ))}
                </div>
              ) : (
                <Text variant="muted">No items added yet</Text>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 mt-6 flex gap-3">
              <UpvoteButton
                count={shop.upvote_count}
                isUpvoted={false} // TODO: Check if user upvoted
                onClick={handleUpvote}
                disabled={toggleUpvote.isPending}
                className="flex-1 justify-center"
              />
              <Button
                variant="secondary"
                onClick={handleDirections}
                className="flex-1"
              >
                🧭 Directions
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
