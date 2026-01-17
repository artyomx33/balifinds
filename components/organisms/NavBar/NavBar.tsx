'use client'

import { useRouter } from 'next/navigation'
import { Button, Avatar } from '@/components/atoms'
import { useCurrency, useAccess } from '@/lib/hooks'
import { cn } from '@/lib/utils/cn'

export interface NavBarProps {
  showSearch?: boolean
  className?: string
}

export const NavBar = ({ showSearch = true, className }: NavBarProps) => {
  const router = useRouter()
  const { currency, cycleCurrency } = useCurrency()
  const { user, isLoading } = useAccess()

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 glass',
      'px-4 py-3 flex items-center justify-between',
      className
    )}>
      {/* Logo */}
      <button
        onClick={() => router.push('/map')}
        className="font-display text-xl font-bold text-gold"
      >
        BaliFinds
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Currency toggle */}
        <button
          onClick={cycleCurrency}
          className="px-2 py-1 text-sm font-medium text-cream bg-dark rounded border border-medium hover:border-gold/50 transition-colors"
        >
          {currency}
        </button>

        {/* Profile/Login */}
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-dark animate-pulse" />
        ) : user ? (
          <button onClick={() => router.push(`/profile/${user.username}`)}>
            <Avatar
              src={user.avatarUrl}
              fallback={user.username[0]?.toUpperCase()}
              size="md"
            />
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  )
}
