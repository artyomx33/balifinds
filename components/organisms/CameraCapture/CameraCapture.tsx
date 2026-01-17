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
        <div className="flex flex-col items-center justify-center h-64 bg-dark rounded-lg p-4">
          <Text variant="muted" className="text-center mb-4">{error}</Text>
          <Button onClick={startCamera}>Try Again</Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-lg bg-dark"
          />
          <canvas ref={canvasRef} className="hidden" />

          {isReady && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white border-4 border-gold shadow-glow flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-gold" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
