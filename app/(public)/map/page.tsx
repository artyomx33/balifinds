import { redirect } from 'next/navigation'
import { DEFAULT_REGION } from '@/lib/regions'

export default function MapPage() {
  redirect(`/${DEFAULT_REGION}/map`)
}
