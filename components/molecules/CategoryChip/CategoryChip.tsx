"use client";

import { CATEGORIES, ShopCategory } from '@/types'
import { cn } from '@/lib/utils/cn'

export interface CategoryChipProps {
  category: ShopCategory
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export const CategoryChip = ({ category, selected, onClick, size = 'md' }: CategoryChipProps) => {
  const info = CATEGORIES[category]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        "border transition-all duration-200 cursor-pointer",
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        selected
          ? "border-gold-500 bg-gold-500/20 text-gold-400 hover:border-gold-400 hover:bg-gold-500/30"
          : "border-charcoal-700 bg-charcoal-900 text-charcoal-300 hover:border-charcoal-600 hover:bg-charcoal-800"
      )}
    >
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </button>
  )
}
