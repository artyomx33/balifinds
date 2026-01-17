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
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200',
        isUpvoted
          ? 'border-gold-500 bg-gold-500/20 text-gold-400'
          : 'border-charcoal-700 bg-charcoal-900 text-charcoal-300 hover:border-charcoal-600',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span className={cn('text-lg', isUpvoted && 'animate-bounce-once')}>👍</span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}
