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
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
        selected
          ? 'border-transparent text-charcoal-950'
          : 'border-charcoal-700 bg-charcoal-900 text-charcoal-300 hover:border-charcoal-600'
      )}
      style={selected && color ? { backgroundColor: color } : undefined}
    >
      {label}
    </button>
  )
}
