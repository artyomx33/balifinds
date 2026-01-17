export type Currency = 'IDR' | 'USD' | 'EUR'

export interface User {
  id: string
  email: string
  username: string
  avatarUrl: string | null
  preferredCurrency: Currency
  createdAt: Date
}

export interface AccessState {
  isLoggedIn: boolean
  hasContributed: boolean
}

export interface UserStats {
  shopCount: number
  itemCount: number
  totalUpvotes: number
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatarUrl: string | null
  shopCount: number
  totalUpvotes: number
  rank: number
}
