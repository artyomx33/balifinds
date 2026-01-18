import { notFound } from 'next/navigation'
import { isValidRegion } from '@/lib/regions'

interface RegionLayoutProps {
  children: React.ReactNode
  params: Promise<{ region: string }>
}

export default async function RegionLayout({ children, params }: RegionLayoutProps) {
  const { region } = await params

  // Validate region
  if (!isValidRegion(region)) {
    notFound()
  }

  return <>{children}</>
}
