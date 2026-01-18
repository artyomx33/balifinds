'use client'

import { useParams } from 'next/navigation'
import { getRegionConfig, DEFAULT_REGION, isValidRegion, type RegionConfig, type RegionId } from '@/lib/regions'

export function useRegion(): { region: RegionId; config: RegionConfig } {
  const params = useParams()
  const regionParam = params?.region as string | undefined

  const region = regionParam && isValidRegion(regionParam) ? regionParam : DEFAULT_REGION
  const config = getRegionConfig(region)

  return { region, config }
}
