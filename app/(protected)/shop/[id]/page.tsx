import { redirect } from 'next/navigation'
import { DEFAULT_REGION } from '@/lib/regions'

interface ShopPageProps {
  params: Promise<{ id: string }>
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params
  redirect(`/${DEFAULT_REGION}/shop/${id}`)
}
