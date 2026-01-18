'use client'

import { useState, useCallback, useRef } from 'react'
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_CONFIG } from '@/lib/mapbox/config'
import { Text } from '@/components/atoms'
import { calculateHaversineDistance, formatDistance } from '@/lib/utils/distance'
import { LOCATION_ACCURACY_THRESHOLD } from '@/lib/constants/map'
import { getRegionConfig, DEFAULT_REGION } from '@/lib/regions'
import { cn } from '@/lib/utils/cn'

export interface LocationPickerProps {
  userLocation: { latitude: number; longitude: number } | null
  onLocationSelect: (lat: number, lng: number, verified: boolean) => void
  className?: string
  region?: string
}

export const LocationPicker = ({ userLocation, onLocationSelect, className, region = DEFAULT_REGION }: LocationPickerProps) => {
  const mapRef = useRef<MapRef>(null)
  const config = getRegionConfig(region)
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(
    userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : null
  )

  const distance = pinLocation && userLocation
    ? calculateHaversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        pinLocation.lat,
        pinLocation.lng
      )
    : null

  const isVerified = distance !== null && distance <= LOCATION_ACCURACY_THRESHOLD

  const handleMapClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat
    setPinLocation({ lat, lng })

    const dist = userLocation
      ? calculateHaversineDistance(userLocation.latitude, userLocation.longitude, lat, lng)
      : 0
    const verified = dist <= LOCATION_ACCURACY_THRESHOLD

    onLocationSelect(lat, lng, verified)
  }, [userLocation, onLocationSelect])

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_CONFIG.accessToken}
          initialViewState={{
            longitude: userLocation?.longitude || config.lng,
            latitude: userLocation?.latitude || config.lat,
            zoom: 15,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAPBOX_CONFIG.style}
          maxBounds={[
            [config.bounds.west, config.bounds.south],
            [config.bounds.east, config.bounds.north],
          ]}
          onClick={handleMapClick}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {/* User location marker */}
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="center"
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            </Marker>
          )}

          {/* Pin location marker */}
          {pinLocation && (
            <Marker
              longitude={pinLocation.lng}
              latitude={pinLocation.lat}
              anchor="bottom"
            >
              <div className="text-3xl">📍</div>
            </Marker>
          )}
        </Map>
      </div>

      {/* Distance indicator */}
      {distance !== null && (
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          isVerified ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
        )}>
          <span>{isVerified ? '✓' : '⚠️'}</span>
          <Text variant="small">
            {isVerified
              ? `You are within ${LOCATION_ACCURACY_THRESHOLD}m of the pin`
              : `You are ${formatDistance(distance)} away. Is this correct?`
            }
          </Text>
        </div>
      )}

      <Text variant="muted" className="text-xs">
        Tap on the map to place the shop location
      </Text>
    </div>
  )
}
