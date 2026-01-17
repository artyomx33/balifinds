import type { Currency } from '@/types'

// Approximate exchange rates (would be fetched in production)
const EXCHANGE_RATES: Record<Currency, number> = {
  IDR: 1,
  USD: 0.0000625, // 1 IDR = 0.0000625 USD (16,000 IDR = 1 USD)
  EUR: 0.0000588, // 1 IDR = 0.0000588 EUR (17,000 IDR = 1 EUR)
}

/**
 * Format price in millions IDR to display string
 */
export const formatPrice = (
  priceMillions: number,
  currency: Currency = 'IDR'
): string => {
  const priceIDR = priceMillions * 1_000_000
  const converted = priceIDR * EXCHANGE_RATES[currency]

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  })

  if (currency === 'IDR') {
    // Show as "5M IDR" instead of full number
    return `${priceMillions}M IDR`
  }

  return formatter.format(converted)
}

/**
 * Format price range
 */
export const formatPriceRange = (
  minMillions: number | null,
  maxMillions: number | null,
  currency: Currency = 'IDR'
): string => {
  if (minMillions === null || maxMillions === null) {
    return 'No items'
  }
  if (minMillions === maxMillions) {
    return formatPrice(minMillions, currency)
  }
  return `${formatPrice(minMillions, currency)} - ${formatPrice(maxMillions, currency)}`
}
