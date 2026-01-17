import { cn } from '@/lib/utils/cn'

export interface IconProps {
  name: string // Emoji or icon name
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Icon = ({ name, size = 'md', className }: IconProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  }

  return (
    <span className={cn('inline-flex items-center justify-center', sizeClasses[size], className)}>
      {name}
    </span>
  )
}
