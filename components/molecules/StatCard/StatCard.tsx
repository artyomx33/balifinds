import { cn } from '@/lib/utils/cn'

export interface StatCardProps {
  value: number | string
  label: string
  className?: string
}

export const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <div className={cn('text-center p-4 bg-dark rounded-lg border border-medium', className)}>
      <div className="text-2xl font-bold text-gold">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  )
}
