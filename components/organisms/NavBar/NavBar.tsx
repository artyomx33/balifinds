'use client'

import { useRouter } from 'next/navigation'
import { Button, Avatar } from '@/components/atoms'
import { useCurrency, useAccess } from '@/lib/hooks'
import { getRegionConfig, DEFAULT_REGION } from '@/lib/regions'
import { cn } from '@/lib/utils/cn'

export interface NavBarProps {
  showSearch?: boolean
  className?: string
  region?: string
}

export const NavBar = ({ showSearch = true, className, region = DEFAULT_REGION }: NavBarProps) => {
  const router = useRouter()
  const { currency, cycleCurrency } = useCurrency()
  const { user, isLoading } = useAccess()
  const config = getRegionConfig(region)

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 glass',
      'px-4 py-3 flex items-center justify-between',
      className
    )}>
      {/* Logo */}
      <button
        onClick={() => router.push(`/${region}/map`)}
        className="font-serif text-xl font-bold text-gradient-gold"
      >
        {config.displayName}
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Currency toggle */}
        <button
          onClick={cycleCurrency}
          className="px-2 py-1 text-sm font-medium text-charcoal-100 bg-charcoal-900 rounded-lg border border-charcoal-700 hover:border-gold-500/50 transition-colors"
        >
          {currency}
        </button>

        {/* Profile/Login */}
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-charcoal-800 animate-pulse" />
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
            variant="outline"
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
