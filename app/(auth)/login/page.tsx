'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text } from '@/components/atoms'
import { InputField } from '@/components/molecules'
import { getSupabaseClient } from '@/lib/supabase'
import { loginSchema, LoginInput } from '@/lib/utils/validation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Authentication not configured')
      setIsLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push('/bali/map')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Text variant="h1" className="text-gradient-gold">CityFinds</Text>
        <Text variant="muted" className="mt-2">Welcome back</Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Login
        </Button>
      </form>

      <p className="text-center text-sm text-charcoal-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-gold-400 hover:underline">
          Register
        </Link>
      </p>

      <Link href="/bali/map" className="block text-center text-sm text-charcoal-400 hover:text-charcoal-100">
        ← Back to map
      </Link>
    </div>
  )
}
