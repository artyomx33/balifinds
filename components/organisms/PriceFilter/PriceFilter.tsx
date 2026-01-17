'use client'

import { PRICE_TIERS } from '@/lib/constants/price-tiers'
import { FilterChip } from '@/components/molecules'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils/cn'

export interface PriceFilterProps {
  className?: string
}

const TIERS = [
  { key: 'TIER_1', ...PRICE_TIERS.TIER_1 },
  { key: 'TIER_2', ...PRICE_TIERS.TIER_2 },
  { key: 'TIER_3', ...PRICE_TIERS.TIER_3 },
  { key: 'TIER_4', ...PRICE_TIERS.TIER_4 },
] as const

export const PriceFilter = ({ className }: PriceFilterProps) => {
  const { priceFilter, setPriceFilter } = useAppStore()

  const handleSelect = (tier: typeof TIERS[number]) => {
    const isSelected = priceFilter.max === tier.max
    if (isSelected) {
      setPriceFilter({})
    } else {
      setPriceFilter({ max: tier.max === Infinity ? undefined : tier.max })
    }
  }

  const isSelected = (tier: typeof TIERS[number]) => {
    if (!priceFilter.max && tier.max === Infinity) return false
    return priceFilter.max === tier.max || (priceFilter.max === undefined && tier.max === Infinity)
  }

  return (
    <div className={cn('flex gap-2 overflow-x-auto no-scrollbar px-4', className)}>
      <span className="text-sm text-charcoal-400 whitespace-nowrap self-center">Price:</span>
      {TIERS.map((tier) => (
        <FilterChip
          key={tier.key}
          label={tier.label}
          color={tier.color}
          selected={isSelected(tier)}
          onClick={() => handleSelect(tier)}
        />
      ))}
    </div>
  )
}
