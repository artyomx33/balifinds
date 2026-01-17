import { cn } from '@/lib/utils/cn'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'teal' | 'category'
  color?: string // For category variant custom colors
  className?: string
}

export const Badge = ({ children, variant = 'default', color, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-charcoal-800 text-charcoal-300': variant === 'default',
          'bg-gold-500/20 text-gold-400 border border-gold-500/30': variant === 'gold',
          'bg-teal-500/20 text-teal-400 border border-teal-500/30': variant === 'teal',
        },
        className
      )}
      style={variant === 'category' && color ? { backgroundColor: `${color}20`, color, borderColor: `${color}30` } : undefined}
    >
      {children}
    </span>
  )
}
