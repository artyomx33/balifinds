import { cn } from '@/lib/utils/cn'

export interface UpvoteButtonProps {
  count: number
  isUpvoted?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export const UpvoteButton = ({ count, isUpvoted, disabled, onClick, className }: UpvoteButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200',
        isUpvoted
          ? 'border-gold bg-gold/20 text-gold'
          : 'border-medium bg-dark text-cream hover:border-gold/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span className={cn('text-lg', isUpvoted && 'animate-bounce-once')}>👍</span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}
