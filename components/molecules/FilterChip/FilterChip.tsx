import { cn } from '@/lib/utils/cn'

export interface FilterChipProps {
  label: string
  selected?: boolean
  color?: string
  onClick?: () => void
}

export const FilterChip = ({ label, selected, color, onClick }: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border',
        selected
          ? 'border-transparent text-black'
          : 'border-medium bg-dark text-cream hover:border-gold/50'
      )}
      style={selected && color ? { backgroundColor: color } : undefined}
    >
      {label}
    </button>
  )
}
