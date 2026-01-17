"use client";

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
          "w-full px-4 py-2.5 bg-charcoal-900 border border-charcoal-700 rounded-lg",
          "text-white placeholder:text-charcoal-500",
          "focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500",
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
