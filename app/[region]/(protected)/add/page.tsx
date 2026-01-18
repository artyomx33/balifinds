'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Text, Spinner } from '@/components/atoms'
import { CategoryChip, InputField, PriceTag } from '@/components/molecules'
import { CameraCapture, LocationPicker } from '@/components/organisms'
import { useAppStore } from '@/store'
import { useGeolocation, useAccess, useCreateShop, useRegion } from '@/lib/hooks'
import { CATEGORY_LIST } from '@/lib/constants/categories'
import type { ShopCategory } from '@/types'
import { cn } from '@/lib/utils/cn'

export default function AddShopPage() {
  const router = useRouter()
  const { region, config } = useRegion()
  const { markContributed } = useAccess()
  const createShop = useCreateShop()
  const geolocation = useGeolocation()
  const store = useAppStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [shopPhoto, setShopPhoto] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; verified: boolean } | null>(null)
  const [category, setCategory] = useState<ShopCategory | null>(null)
  const [items, setItems] = useState<{ dataUrl: string; price: number }[]>([])
  const [currentPrice, setCurrentPrice] = useState('')
  const [isCapturingItem, setIsCapturingItem] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get user location on mount
  useEffect(() => {
    geolocation.getCurrentPosition()
  }, [])

  const handleShopPhotoCapture = (dataUrl: string) => {
    setShopPhoto(dataUrl)
    setStep(2)
  }

  const handleLocationSelect = (lat: number, lng: number, verified: boolean) => {
    setLocation({ lat, lng, verified })
  }

  const handleContinueToItems = () => {
    if (location && category) {
      setStep(3)
    }
  }

  const handleItemCapture = (dataUrl: string) => {
    const price = parseFloat(currentPrice)
    if (!isNaN(price) && price > 0) {
      setItems([...items, { dataUrl, price }])
      setCurrentPrice('')
      setIsCapturingItem(false)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!shopPhoto || !location || !category || items.length === 0) return

    setIsSubmitting(true)

    try {
      // For now, use dataUrls directly (in production, upload to Supabase Storage)
      await createShop.mutateAsync({
        photoUrl: shopPhoto,
        latitude: location.lat,
        longitude: location.lng,
        category,
        locationVerified: location.verified,
        region,
        items: items.map(item => ({
          photoUrl: item.dataUrl,
          priceMillions: item.price,
        })),
      })

      // Mark as contributed for access
      markContributed()

      // Reset and go to map
      router.push(`/${region}/map`)
    } catch (error) {
      console.error('Failed to create shop:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            if (step === 1) router.back()
            else setStep((step - 1) as 1 | 2 | 3)
          }}
          className="text-charcoal-100"
        >
          ← Back
        </button>
        <Text variant="small" className="text-charcoal-400">
          Step {step} of 3
        </Text>
      </div>

      <div className="pt-16 px-4 pb-6">
        {/* Step 1: Capture Shop Photo */}
        {step === 1 && (
          <div className="space-y-4">
            <Text variant="h2" className="pt-4">Take a photo of the shop</Text>
            <CameraCapture
              onCapture={handleShopPhotoCapture}
              className="mt-4"
            />
          </div>
        )}

        {/* Step 2: Location & Category */}
        {step === 2 && (
          <div className="space-y-6 pt-4">
            {/* Shop Photo Preview */}
            {shopPhoto && (
              <img
                src={shopPhoto}
                alt="Shop"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}

            <div>
              <Text variant="h3" className="mb-3">Confirm location</Text>
              <LocationPicker
                userLocation={
                  geolocation.latitude && geolocation.longitude
                    ? { latitude: geolocation.latitude, longitude: geolocation.longitude }
                    : null
                }
                onLocationSelect={handleLocationSelect}
                region={region}
              />
            </div>

            <div>
              <Text variant="h3" className="mb-3">Select category</Text>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LIST.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    category={cat.id}
                    selected={category === cat.id}
                    onClick={() => setCategory(cat.id)}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleContinueToItems}
              disabled={!location || !category}
              className="w-full"
            >
              Continue to Items →
            </Button>
          </div>
        )}

        {/* Step 3: Add Items */}
        {step === 3 && (
          <div className="space-y-4 pt-4">
            <Text variant="h2">Add items</Text>
            <Text variant="muted">Items added: {items.length}</Text>

            {/* Items grid */}
            {items.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {items.map((item, index) => (
                  <div key={index} className="relative">
                    <img
                      src={item.dataUrl}
                      alt={`Item ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-0.5">
                      <PriceTag priceMillions={item.price} size="sm" />
                    </div>
                  </div>
                ))}
                {!isCapturingItem && (
                  <button
                    onClick={() => setIsCapturingItem(true)}
                    className="w-full aspect-square bg-charcoal-900 border-2 border-dashed border-charcoal-700 rounded-md flex items-center justify-center text-2xl text-charcoal-400 hover:border-gold-500/50"
                  >
                    +
                  </button>
                )}
              </div>
            )}

            {/* Capture item */}
            {(isCapturingItem || items.length === 0) && (
              <div className="space-y-3">
                <CameraCapture onCapture={handleItemCapture} />

                <InputField
                  label="Price (millions IDR)"
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                />

                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setIsCapturingItem(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}

            {/* Submit */}
            {items.length > 0 && !isCapturingItem && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
              >
                Submit Shop
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
