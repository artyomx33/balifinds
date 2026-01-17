import type { ShopCategory, CategoryInfo } from '@/types'

export const CATEGORIES: Record<ShopCategory, CategoryInfo> = {
  wood: { label: 'Wood & Carvings', icon: '🪵', color: '#8B5E3C' },
  ceramics: { label: 'Ceramics & Pottery', icon: '🏺', color: '#E67E22' },
  stone: { label: 'Stone & Statues', icon: '🗿', color: '#7F8C8D' },
} as const

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([key, value]) => ({
  id: key as ShopCategory,
  ...value,
}))
