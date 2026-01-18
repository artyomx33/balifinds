'use client'

import { useRef, useCallback, useEffect } from 'react'
import Map, { Marker, NavigationControl, GeolocateControl, MapRef } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_CONFIG } from '@/lib/mapbox/config'
import { getPriceHeatColor, getCircleRadius } from '@/lib/constants/price-tiers'
import { useShops } from '@/lib/hooks'
import { useAppStore } from '@/store'
import { getRegionConfig, DEFAULT_REGION } from '@/lib/regions'
import { cn } from '@/lib/utils/cn'

export interface MapViewProps {
  className?: string
  onShopClick?: (shopId: string) => void
  region?: string
}

export const MapView = ({ className, onShopClick, region = DEFAULT_REGION }: MapViewProps) => {
  const mapRef = useRef<MapRef>(null)
  const { selectedCategory, priceFilter, setCenter, setZoom } = useAppStore()
  const config = getRegionConfig(region)

  const { data: shops, isLoading } = useShops({
    category: selectedCategory || undefined,
    maxPrice: priceFilter.max,
    region,
  })

  const handleMove = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      const zoom = mapRef.current.getZoom()
      setCenter(center.lat, center.lng)
      setZoom(zoom)
    }
  }, [setCenter, setZoom])

  return (
    <div className={cn('relative w-full h-full', className)}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_CONFIG.accessToken}
        initialViewState={{
          longitude: config.lng,
          latitude: config.lat,
          zoom: config.zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_CONFIG.style}
        maxBounds={[
          [config.bounds.west, config.bounds.south],
          [config.bounds.east, config.bounds.north],
        ]}
        onMoveEnd={handleMove}
        attributionControl={false}
      >
        {/* Navigation controls */}
        <NavigationControl position="top-right" showCompass={false} />

        {/* Geolocate button */}
        <GeolocateControl
          position="bottom-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={false}
          showUserHeading={false}
          style={{ marginBottom: '100px' }}
        />

        {/* Shop markers */}
        {shops?.map((shop) => {
          const color = getPriceHeatColor(shop.avg_price_millions || 0)
          const radius = getCircleRadius(shop.item_count || 0)

          return (
            <Marker
              key={shop.id}
              longitude={Number(shop.longitude)}
              latitude={Number(shop.latitude)}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                onShopClick?.(shop.id)
              }}
            >
              <button
                className="rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  backgroundColor: color,
                  boxShadow: `0 0 ${radius}px ${color}80`,
                }}
              />
            </Marker>
          )
        })}
      </Map>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
