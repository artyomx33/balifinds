import { StateCreator } from 'zustand'
import type { ShopCategory } from '@/types'
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants/map'

export interface MapSlice {
  // View state
  center: { latitude: number; longitude: number }
  zoom: number

  // Filters
  selectedCategory: ShopCategory | null
  priceFilter: { min?: number; max?: number }

  // Selected shop for bottom sheet
  selectedShopId: string | null

  // Actions
  setCenter: (lat: number, lng: number) => void
  setZoom: (zoom: number) => void
  setSelectedCategory: (category: ShopCategory | null) => void
  setPriceFilter: (filter: { min?: number; max?: number }) => void
  setSelectedShopId: (id: string | null) => void
  resetFilters: () => void
}

export const createMapSlice: StateCreator<MapSlice> = (set) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  selectedCategory: null,
  priceFilter: {},
  selectedShopId: null,

  setCenter: (latitude, longitude) => set({ center: { latitude, longitude } }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setPriceFilter: (filter) => set({ priceFilter: filter }),
  setSelectedShopId: (id) => set({ selectedShopId: id }),
  resetFilters: () => set({ selectedCategory: null, priceFilter: {} }),
})
