import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-gold text-black hover:bg-gold-light active:bg-gold-dark': variant === 'primary',
            'bg-dark text-cream border border-medium hover:bg-medium': variant === 'secondary',
            'bg-transparent text-cream hover:bg-dark': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
            // Sizes
            'text-sm px-3 py-1.5': size === 'sm',
            'text-base px-4 py-2': size === 'md',
            'text-lg px-6 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 animate-spin">&#8987;</span>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
