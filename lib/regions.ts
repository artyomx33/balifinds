// Region configuration for CityFinds multi-region support

export interface RegionConfig {
  name: string
  displayName: string
  lat: number
  lng: number
  zoom: number
  bounds: {
    north: number
    south: number
    west: number
    east: number
  }
}

export const REGIONS: Record<string, RegionConfig> = {
  bali: {
    name: 'Bali',
    displayName: 'BaliFinds',
    lat: -8.5069,
    lng: 115.2625,
    zoom: 10,
    bounds: {
      north: -8.0,
      south: -8.9,
      west: 114.4,
      east: 115.8,
    },
  },
  tulum: {
    name: 'Tulum',
    displayName: 'TulumFinds',
    lat: 20.2114,
    lng: -87.4654,
    zoom: 12,
    bounds: {
      north: 20.35,
      south: 20.05,
      west: -87.55,
      east: -87.35,
    },
  },
} as const

export type RegionId = keyof typeof REGIONS

export const DEFAULT_REGION: RegionId = 'bali'

export const VALID_REGIONS = Object.keys(REGIONS) as RegionId[]

export function isValidRegion(region: string): region is RegionId {
  return region in REGIONS
}

export function getRegionConfig(region: string): RegionConfig {
  if (isValidRegion(region)) {
    return REGIONS[region]
  }
  return REGIONS[DEFAULT_REGION]
}
