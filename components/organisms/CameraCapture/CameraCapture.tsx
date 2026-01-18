'use client'

import { useEffect } from 'react'
import { Button, Text } from '@/components/atoms'
import { useCamera } from '@/lib/hooks/useCamera'
import { cn } from '@/lib/utils/cn'

export interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
  className?: string
}

export const CameraCapture = ({ onCapture, className }: CameraCaptureProps) => {
  const { videoRef, canvasRef, error, isReady, startCamera, capturePhoto } = useCamera()

  useEffect(() => {
    startCamera()
  }, [startCamera])

  const handleCapture = () => {
    const dataUrl = capturePhoto()
    if (dataUrl) {
      onCapture(dataUrl)
    }
  }

  return (
    <div className={cn('relative', className)}>
      {error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-charcoal-900 rounded-lg p-4">
          <Text variant="muted" className="text-center mb-4">{error}</Text>
          <Button onClick={startCamera}>Try Again</Button>
        </div>
      ) : (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-charcoal-900">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {isReady && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                type="button"
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white border-4 border-gold-500 glow-gold flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
