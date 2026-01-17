import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')

export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .max(1000, 'Price cannot exceed 1000M IDR')

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const shopSchema = z.object({
  photoUrl: z.string().url('Invalid photo URL'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  category: z.enum(['wood', 'ceramics', 'stone']),
  locationVerified: z.boolean(),
})

export const itemSchema = z.object({
  photoUrl: z.string().url('Invalid photo URL'),
  priceMillions: priceSchema,
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ShopInput = z.infer<typeof shopSchema>
export type ItemInput = z.infer<typeof itemSchema>
