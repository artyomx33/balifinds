import { StateCreator } from 'zustand'
import type { ShopCategory } from '@/types'

export interface AddShopItem {
  photoUrl: string
  priceMillions: number
}

export interface AddShopSlice {
  // Wizard state
  step: 1 | 2 | 3

  // Shop data
  shopPhotoUrl: string | null
  latitude: number | null
  longitude: number | null
  locationVerified: boolean
  category: ShopCategory | null
  items: AddShopItem[]

  // Actions
  setStep: (step: 1 | 2 | 3) => void
  setShopPhoto: (url: string) => void
  setLocation: (lat: number, lng: number, verified: boolean) => void
  setCategory: (category: ShopCategory) => void
  addItem: (item: AddShopItem) => void
  removeItem: (index: number) => void
  reset: () => void
}

const initialState = {
  step: 1 as const,
  shopPhotoUrl: null,
  latitude: null,
  longitude: null,
  locationVerified: false,
  category: null,
  items: [],
}

export const createAddShopSlice: StateCreator<AddShopSlice> = (set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setShopPhoto: (url) => set({ shopPhotoUrl: url }),
  setLocation: (latitude, longitude, verified) => set({ latitude, longitude, locationVerified: verified }),
  setCategory: (category) => set({ category }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) => set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
  reset: () => set(initialState),
})
