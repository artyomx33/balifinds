import { redirect } from 'next/navigation'
import { DEFAULT_REGION } from '@/lib/regions'

export default function AddPage() {
  redirect(`/${DEFAULT_REGION}/add`)
}
