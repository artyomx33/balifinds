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
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-all duration-200',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        selected
          ? 'border-gold bg-gold/20 text-gold'
          : 'border-medium bg-dark text-cream hover:border-gold/50'
      )}
    >
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </button>
  )
}
