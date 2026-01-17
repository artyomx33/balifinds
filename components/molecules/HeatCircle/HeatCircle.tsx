import { getPriceHeatColor, getCircleRadius } from '@/lib/constants/price-tiers'
import { cn } from '@/lib/utils/cn'

export interface HeatCircleProps {
  avgPriceMillions: number
  itemCount: number
  onClick?: () => void
  className?: string
}

export const HeatCircle = ({ avgPriceMillions, itemCount, onClick, className }: HeatCircleProps) => {
  const color = getPriceHeatColor(avgPriceMillions)
  const radius = getCircleRadius(itemCount)

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer',
        'shadow-lg',
        className
      )}
      style={{
        width: radius * 2,
        height: radius * 2,
        backgroundColor: color,
        boxShadow: `0 0 ${radius}px ${color}80`,
      }}
    />
  )
}
