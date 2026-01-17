import { Avatar } from '@/components/atoms'
import { cn } from '@/lib/utils/cn'

export interface UserBadgeProps {
  username: string
  avatarUrl?: string | null
  size?: 'sm' | 'md'
  className?: string
}

export const UserBadge = ({ username, avatarUrl, size = 'md', className }: UserBadgeProps) => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Avatar
        src={avatarUrl}
        size={size}
        fallback={username[0]?.toUpperCase()}
      />
      <span className={cn('text-cream', size === 'sm' ? 'text-sm' : 'text-base')}>
        @{username}
      </span>
    </div>
  )
}
