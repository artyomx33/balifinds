import { cn } from '@/lib/utils/cn'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'category'
  color?: string // For category variant custom colors
  className?: string
}

export const Badge = ({ children, variant = 'default', color, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-dark text-cream border border-medium': variant === 'default',
          'bg-gold/20 text-gold border border-gold/30': variant === 'gold',
        },
        className
      )}
      style={variant === 'category' && color ? { backgroundColor: `${color}20`, color, borderColor: `${color}30` } : undefined}
    >
      {children}
    </span>
  )
}
