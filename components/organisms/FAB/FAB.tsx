'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

export interface FABProps {
  className?: string
}

export const FAB = ({ className }: FABProps) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/add')}
      className={cn(
        'fixed bottom-20 right-4 z-40',
        'w-14 h-14 rounded-full',
        'bg-gold-500 text-charcoal-950',
        'flex items-center justify-center',
        'text-2xl font-bold',
        'shadow-lg hover:shadow-xl glow-gold',
        'transition-all duration-200 hover:scale-110 hover:bg-gold-400',
        'active:scale-95',
        className
      )}
    >
      +
    </button>
  )
}
