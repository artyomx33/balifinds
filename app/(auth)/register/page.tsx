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
import { registerSchema, RegisterInput } from '@/lib/utils/validation'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Authentication not configured')
      setIsLoading(false)
      return
    }

    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await (supabase.from('bali_users') as any).insert({
        id: authData.user.id,
        email: data.email,
        username: data.username,
      })

      if (profileError) {
        setError(profileError.message)
        setIsLoading(false)
        return
      }

      router.push('/map')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Text variant="h1" className="text-gold">BaliFinds</Text>
        <Text variant="muted" className="mt-2">Create your account</Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Username"
          placeholder="craftsman42"
          hint="Lowercase letters, numbers, and underscores only"
          error={errors.username?.message}
          {...register('username')}
        />

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
          hint="At least 8 characters"
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
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-gold hover:underline">
          Login
        </Link>
      </p>

      <Link href="/map" className="block text-center text-sm text-muted hover:text-cream">
        ← Back to map
      </Link>
    </div>
  )
}
