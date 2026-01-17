import { HTMLAttributes, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'muted'
  children?: ReactNode
}

const getDefaultElement = (variant: string): ElementType => {
  if (variant === 'h1') return 'h1'
  if (variant === 'h2') return 'h2'
  if (variant === 'h3') return 'h3'
  return 'p'
}

export const Text = ({
  as,
  variant = 'body',
  className,
  children,
  ...props
}: TextProps) => {
  const Component = as || getDefaultElement(variant)

  return (
    <Component
      className={cn(
        {
          'font-serif text-3xl font-bold text-white': variant === 'h1',
          'font-serif text-2xl font-semibold text-white': variant === 'h2',
          'font-serif text-xl font-medium text-white': variant === 'h3',
          'text-base text-charcoal-100': variant === 'body',
          'text-sm text-charcoal-200': variant === 'small',
          'text-sm text-charcoal-400': variant === 'muted',
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
