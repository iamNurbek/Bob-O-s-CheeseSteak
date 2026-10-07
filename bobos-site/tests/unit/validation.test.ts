import { describe, expect, it } from 'vitest'

import { checkoutRequestSchema, contactSchema, toFieldErrors } from '@/lib/validation'

const validCheckout = {
  lines: [{ menuItemId: 'the-bob-o', quantity: 2 }],
  fulfillment: 'pickup',
  tip: { type: 'percent', value: 20 },
}

describe('checkoutRequestSchema', () => {
  it('accepts a valid request and strips unknown fields like prices', () => {
    const parsed = checkoutRequestSchema.parse({
      ...validCheckout,
      lines: [{ menuItemId: 'the-bob-o', quantity: 1, priceCents: 1 }],
    })
    expect(parsed.lines[0]).not.toHaveProperty('priceCents')
  })

  it.each([
    ['empty cart', { ...validCheckout, lines: [] }],
    ['zero quantity', { ...validCheckout, lines: [{ menuItemId: 'x', quantity: 0 }] }],
    ['fractional quantity', { ...validCheckout, lines: [{ menuItemId: 'x', quantity: 1.5 }] }],
    ['bad fulfillment', { ...validCheckout, fulfillment: 'drone' }],
    ['unsupported tip %', { ...validCheckout, tip: { type: 'percent', value: 50 } }],
    ['negative custom tip', { ...validCheckout, tip: { type: 'custom', cents: -1 } }],
    ['huge custom tip', { ...validCheckout, tip: { type: 'custom', cents: 1_000_000 } }],
  ])('rejects %s', (_label, input) => {
    expect(checkoutRequestSchema.safeParse(input).success).toBe(false)
  })
})

describe('contactSchema', () => {
  it('trims and validates', () => {
    const result = contactSchema.safeParse({ name: '  ', email: 'nope', message: 'hi' })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(Object.keys(toFieldErrors(result.error)).sort()).toEqual(['email', 'message', 'name'])
  })

  it('accepts a good message', () => {
    expect(
      contactSchema.safeParse({
        name: 'Sam',
        email: 'sam@example.com',
        message: 'Do you cater office lunches?',
      }).success,
    ).toBe(true)
  })
})
