import { cn } from '@/lib/utils/cn'

export interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  fallback?: string
  className?: string
}

export const Avatar = ({ src, alt = 'Avatar', size = 'md', fallback, className }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-full bg-gold/20 text-gold flex items-center justify-center font-medium',
          sizeClasses[size],
          className
        )}
      >
        {fallback || '\u{1F464}'}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', sizeClasses[size], className)}
    />
  )
}
