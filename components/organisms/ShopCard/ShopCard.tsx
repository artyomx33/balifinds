'use client'

import { Badge } from '@/components/atoms'
import { PriceTag } from '@/components/molecules'
import { CATEGORIES } from '@/types'
import { formatDistance } from '@/lib/utils/distance'
import { useCurrency } from '@/lib/hooks'
import { cn } from '@/lib/utils/cn'

interface ShopCardProps {
  shop: {
    id: string
    photo_url: string
    category: string
    upvote_count: number
    item_count: number
    items?: Array<{ id: string; photo_url: string; price_millions: number }>
  }
  distance: number | null
  onClick: () => void
  className?: string
}

export const ShopCard = ({ shop, distance, onClick, className }: ShopCardProps) => {
  const { currency } = useCurrency()
  const categoryInfo = CATEGORIES[shop.category as keyof typeof CATEGORIES]
  const items = shop.items || []

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl overflow-hidden',
        'bg-charcoal-900 border border-charcoal-800',
        'transition-all duration-200 hover:border-charcoal-700 hover:shadow-lg',
        'active:scale-[0.98]',
        className
      )}
    >
      {/* Hero Image */}
      <div className="relative aspect-[16/9]">
        <img
          src={shop.photo_url}
          alt="Shop"
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        {categoryInfo && (
          <div className="absolute top-3 right-3">
            <Badge variant="category" color={categoryInfo.color}>
              {categoryInfo.icon} {categoryInfo.label}
            </Badge>
          </div>
        )}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-charcoal-950">
        {[0, 1, 2].map((index) => {
          const item = items[index]
          return (
            <div
              key={index}
              className="relative aspect-square bg-charcoal-800 rounded-md overflow-hidden"
            >
              {item ? (
                <>
                  <img
                    src={item.photo_url}
                    alt={`Item ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <PriceTag
                      priceMillions={item.price_millions}
                      currency={currency}
                      size="sm"
                      className="text-xs"
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal-600">
                  <span className="text-2xl">📷</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-charcoal-300">
          <span>📍</span>
          <span>
            {distance !== null ? formatDistance(distance) : 'Location unknown'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-charcoal-400">
          <span>👍</span>
          <span>{shop.upvote_count}</span>
        </div>
      </div>
    </button>
  )
}
