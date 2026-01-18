import { redirect } from 'next/navigation'
import { DEFAULT_REGION } from '@/lib/regions'

export default function Home() {
  redirect(`/${DEFAULT_REGION}/map`)
}
