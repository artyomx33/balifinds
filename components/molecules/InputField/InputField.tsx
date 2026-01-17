"use client";

import { forwardRef, InputHTMLAttributes } from 'react'
import { Input } from '@/components/atoms'
import { cn } from '@/lib/utils/cn'

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-charcoal-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <Input ref={ref} id={inputId} error={!!error} {...props} />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-charcoal-500">{hint}</p>}
      </div>
    )
  }
)
InputField.displayName = 'InputField'
