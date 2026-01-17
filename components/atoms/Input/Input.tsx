import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 bg-dark border rounded-md text-cream placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold',
          'transition-colors duration-200',
          error ? 'border-red-500' : 'border-medium',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
