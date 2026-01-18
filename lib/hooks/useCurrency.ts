'use client'

import { useState, useCallback } from 'react'
import type { Currency } from '@/types'

const CURRENCY_KEY = 'cityfinds_currency'
const CURRENCIES: Currency[] = ['IDR', 'USD', 'EUR']

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(CURRENCY_KEY) as Currency) || 'IDR'
    }
    return 'IDR'
  })

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_KEY, newCurrency)
  }, [])

  const cycleCurrency = useCallback(() => {
    const currentIndex = CURRENCIES.indexOf(currency)
    const nextIndex = (currentIndex + 1) % CURRENCIES.length
    setCurrency(CURRENCIES[nextIndex])
  }, [currency, setCurrency])

  return {
    currency,
    setCurrency,
    cycleCurrency,
  }
}
