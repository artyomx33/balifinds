import { cn } from '@/lib/utils/cn'

export interface StatCardProps {
  value: number | string
  label: string
  className?: string
}

export const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <div className={cn('text-center p-4 bg-charcoal-900 rounded-xl border border-charcoal-800', className)}>
      <div className="text-2xl font-bold text-gold-400">{value}</div>
      <div className="text-sm text-charcoal-400">{label}</div>
    </div>
  )
}
