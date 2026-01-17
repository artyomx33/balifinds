import { StateCreator } from 'zustand'
import type { User, Currency } from '@/types'

export interface AuthSlice {
  user: User | null
  isLoading: boolean

  setUser: (user: User | null) => void
  setIsLoading: (loading: boolean) => void
  updateCurrency: (currency: Currency) => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateCurrency: (currency) => set((state) => ({
    user: state.user ? { ...state.user, preferredCurrency: currency } : null,
  })),
})
