'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useAccess } from '@/lib/hooks'
import { DEFAULT_REGION } from '@/lib/regions'

interface NavItem {
  icon: string
  label: string
  href: string
  requiresAuth?: boolean
  isGlobal?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { icon: '🗺️', label: 'Map', href: '/map' },
  { icon: '📍', label: 'Nearby', href: '/nearby' },
  { icon: '👤', label: 'Profile', href: '/profile', requiresAuth: true, isGlobal: true },
  { icon: '🏆', label: 'Leaders', href: '/leaderboard', isGlobal: true },
]

interface BottomNavProps {
  region?: string
}

export const BottomNav = ({ region = DEFAULT_REGION }: BottomNavProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAccess()

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !user) {
      router.push('/login')
    } else if (item.href === '/profile' && user) {
      router.push(`/profile/${user.username}`)
    } else if (item.isGlobal) {
      router.push(item.href)
    } else {
      router.push(`/${region}${item.href}`)
    }
  }

  const isActive = (href: string) => {
    if (href === '/profile') {
      return pathname.startsWith('/profile')
    }
    if (href === '/leaderboard') {
      return pathname === '/leaderboard'
    }
    // For region-specific routes
    return pathname.includes(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-charcoal-800">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavClick(item)}
            className={cn(
              'flex flex-col items-center gap-1 px-6 py-2 transition-colors',
              isActive(item.href)
                ? 'text-gold-400'
                : 'text-charcoal-400 hover:text-charcoal-100'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
