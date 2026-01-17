import { formatPrice } from '@/lib/utils/price'
import { Currency } from '@/types'
import { cn } from '@/lib/utils/cn'

export interface PriceTagProps {
  priceMillions: number
  currency?: Currency
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const PriceTag = ({ priceMillions, currency = 'IDR', size = 'md', className }: PriceTagProps) => {
  return (
    <span
      className={cn(
        'font-medium text-gold',
        {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        },
        className
      )}
    >
      {formatPrice(priceMillions, currency)}
    </span>
  )
}
