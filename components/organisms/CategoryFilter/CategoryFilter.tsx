'use client'

import { CategoryChip } from '@/components/molecules'
import { CATEGORY_LIST } from '@/lib/constants/categories'
import { useAppStore } from '@/store'
import type { ShopCategory } from '@/types'
import { cn } from '@/lib/utils/cn'

export interface CategoryFilterProps {
  className?: string
}

export const CategoryFilter = ({ className }: CategoryFilterProps) => {
  const { selectedCategory, setSelectedCategory } = useAppStore()

  const handleSelect = (category: ShopCategory | null) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  return (
    <div className={cn('flex gap-2 overflow-x-auto no-scrollbar px-4', className)}>
      <button
        type="button"
        onClick={() => handleSelect(null)}
        className={cn(
          'px-3 py-1.5 text-sm rounded-full border whitespace-nowrap transition-all',
          !selectedCategory
            ? 'bg-gold-500/20 border-gold-500 text-gold-400'
            : 'bg-charcoal-900 border-charcoal-700 text-charcoal-100 hover:border-gold-500/50'
        )}
      >
        All
      </button>
      {CATEGORY_LIST.map((cat) => (
        <CategoryChip
          key={cat.id}
          category={cat.id}
          selected={selectedCategory === cat.id}
          onClick={() => handleSelect(cat.id)}
          size="sm"
        />
      ))}
    </div>
  )
}
