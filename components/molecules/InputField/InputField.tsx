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
      <div className={cn('space-y-1', className)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-cream">
            {label}
          </label>
        )}
        <Input ref={ref} id={inputId} error={!!error} {...props} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-sm text-muted">{hint}</p>}
      </div>
    )
  }
)
InputField.displayName = 'InputField'
