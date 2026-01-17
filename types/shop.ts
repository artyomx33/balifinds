export type ShopCategory = 'wood' | 'ceramics' | 'stone'

export interface CategoryInfo {
  label: string
  icon: string
  color: string
}

export const CATEGORIES: Record<ShopCategory, CategoryInfo> = {
  wood: { label: 'Wood & Carvings', icon: '🪵', color: '#8B5E3C' },
  ceramics: { label: 'Ceramics & Pottery', icon: '🏺', color: '#E67E22' },
  stone: { label: 'Stone & Statues', icon: '🗿', color: '#7F8C8D' },
} as const

export interface Shop {
  id: string
  userId: string | null
  photoUrl: string
  latitude: number
  longitude: number
  locationVerified: boolean
  category: ShopCategory
  upvoteCount: number
  itemCount: number
  minPriceMillions: number | null
  maxPriceMillions: number | null
  avgPriceMillions: number | null
  createdAt: Date
  updatedAt: Date
  // Joined data
  user?: {
    username: string
    avatarUrl: string | null
  }
  items?: Item[]
}

export interface Item {
  id: string
  shopId: string
  photoUrl: string
  priceMillions: number
  createdAt: Date
}

export interface ShopFilters {
  category?: ShopCategory
  minPrice?: number
  maxPrice?: number
}

export interface LocationVerification {
  userCoords: { lat: number; lng: number }
  pinCoords: { lat: number; lng: number }
  distance: number
  needsConfirmation: boolean
}
