import { z } from 'zod'

import {
  MAX_CART_LINES,
  MAX_CUSTOM_TIP_CENTS,
  MAX_LINE_QUANTITY,
  TIP_PERCENT_OPTIONS,
} from '@/constants/limits'

// One set of schemas shared by the browser and the API routes.

export const selectedOptionsSchema = z.record(
  z.string().max(64),
  z.array(z.string().max(64)).max(10),
)

export const cartLineInputSchema = z.object({
  menuItemId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
  selectedOptions: selectedOptionsSchema.optional(),
})

export const storedCartLineSchema = cartLineInputSchema.extend({ key: z.string().max(512) })

export const tipSelectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('percent'),
    value: z.union(TIP_PERCENT_OPTIONS.map((value) => z.literal(value))),
  }),
  z.object({
    type: z.literal('custom'),
    cents: z.number().int().min(0).max(MAX_CUSTOM_TIP_CENTS),
  }),
])

export const fulfillmentSchema = z.enum(['delivery', 'pickup'])

export const checkoutRequestSchema = z.object({
  lines: z.array(cartLineInputSchema).min(1, 'Your cart is empty.').max(MAX_CART_LINES),
  fulfillment: fulfillmentSchema,
  tip: tipSelectionSchema,
})

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(80, 'Name is too long.'),
  email: z.email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least 10 characters.')
    .max(1000, 'Please keep it under 1,000 characters.'),
})

export type ContactInput = z.infer<typeof contactSchema>

/** Flattens zod issues into { field: firstMessage } for form display. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form')
    errors[field] ??= issue.message
  }
  return errors
}
