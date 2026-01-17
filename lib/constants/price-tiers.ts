export const PRICE_TIERS = {
  TIER_1: { max: 5, color: '#C45C3E', label: '≤5M' },
  TIER_2: { max: 10, color: '#4ECDC4', label: '≤10M' },
  TIER_3: { max: 15, color: '#FF6B9D', label: '≤15M' },
  TIER_4: { max: Infinity, color: '#C9A227', label: '20M+' },
} as const

export type PriceTier = keyof typeof PRICE_TIERS

export const getPriceHeatColor = (avgPriceMillions: number): string => {
  if (avgPriceMillions <= 5) return PRICE_TIERS.TIER_1.color
  if (avgPriceMillions <= 10) return PRICE_TIERS.TIER_2.color
  if (avgPriceMillions <= 15) return PRICE_TIERS.TIER_3.color
  return PRICE_TIERS.TIER_4.color
}

export const getCircleRadius = (itemCount: number): number => {
  return Math.min(10 + itemCount * 3, 30)
}
