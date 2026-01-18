import { redirect } from 'next/navigation'
import { DEFAULT_REGION } from '@/lib/regions'

export default function NearbyPage() {
  redirect(`/${DEFAULT_REGION}/nearby`)
}
