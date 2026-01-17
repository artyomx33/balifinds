import { create } from 'zustand'
import { createMapSlice, MapSlice } from './slices/mapSlice'
import { createAddShopSlice, AddShopSlice } from './slices/addShopSlice'
import { createAuthSlice, AuthSlice } from './slices/authSlice'

type AppStore = MapSlice & AddShopSlice & AuthSlice

export const useAppStore = create<AppStore>()((...args) => ({
  ...createMapSlice(...args),
  ...createAddShopSlice(...args),
  ...createAuthSlice(...args),
}))
