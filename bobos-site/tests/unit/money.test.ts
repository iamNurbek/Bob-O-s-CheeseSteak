import { describe, expect, it } from 'vitest'

import { MAX_CUSTOM_TIP_CENTS } from '@/constants/limits'
import {
  calculateTipCents,
  calculateTotals,
  calculateUnitPrice,
  clampTipCents,
  formatPrice,
  toCents,
} from '@/lib/money'
import type { OptionGroup } from '@/types/menu'

describe('toCents', () => {
  it.each([
    [11.99, 1199],
    [0.1 + 0.2, 30],
    [1.005, 100],
    [0, 0],
  ])('converts %s dollars to %s cents', (dollars, cents) => {
    expect(toCents(dollars)).toBe(cents)
  })

  it('treats non-finite input as zero', () => {
    expect(toCents(Number.NaN)).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formats cents as US dollars', () => {
    expect(formatPrice(1199)).toBe('$11.99')
    expect(formatPrice(150)).toBe('$1.50')
    expect(formatPrice(0)).toBe('$0.00')
  })
})

describe('calculateTipCents', () => {
  it('rounds 15% of $11.99 (179.85¢) to 180¢', () => {
    expect(calculateTipCents(1199, { type: 'percent', value: 15 })).toBe(180)
  })

  it.each([
    [1199, 15, 180],
    [1199, 20, 240],
    [1199, 25, 300],
    [2398, 15, 360],
    [2398, 20, 480],
    [2398, 25, 600],
    [4567, 15, 685],
    [4567, 20, 913],
    [4567, 25, 1142],
    [0, 20, 0],
  ] as const)('subtotal %i¢ at %i%% → %i¢', (subtotal, value, expected) => {
    expect(calculateTipCents(subtotal, { type: 'percent', value })).toBe(expected)
  })

  it('uses the custom amount, clamped', () => {
    expect(calculateTipCents(1000, { type: 'custom', cents: 500 })).toBe(500)
    expect(calculateTipCents(1000, { type: 'custom', cents: -5 })).toBe(0)
    expect(calculateTipCents(1000, { type: 'custom', cents: 999_999 })).toBe(MAX_CUSTOM_TIP_CENTS)
  })
})

describe('clampTipCents', () => {
  it('rounds fractional cents and rejects NaN', () => {
    expect(clampTipCents(250.6)).toBe(251)
    expect(clampTipCents(Number.NaN)).toBe(0)
  })
})

describe('calculateUnitPrice', () => {
  const toppings: OptionGroup = {
    id: 'toppings',
    label: 'Toppings',
    minSelected: 3,
    maxSelected: 5,
    includedCount: 3,
    extraChoiceCents: 49,
    choices: ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, label: id, priceDeltaCents: 0 })),
  }
  const extras: OptionGroup = {
    id: 'extras',
    label: 'Extras',
    minSelected: 0,
    maxSelected: 2,
    choices: [
      { id: 'meat', label: 'Extra meat', priceDeltaCents: 399 },
      { id: 'cheese', label: 'Extra cheese', priceDeltaCents: 99 },
    ],
  }

  it('returns the base price with no options', () => {
    expect(calculateUnitPrice(1199)).toBe(1199)
  })

  it('adds choice deltas', () => {
    expect(calculateUnitPrice(1199, [extras], { extras: ['meat', 'cheese'] })).toBe(1697)
  })

  it('charges only for choices beyond the included count', () => {
    expect(calculateUnitPrice(1199, [toppings], { toppings: ['a', 'b', 'c'] })).toBe(1199)
    expect(calculateUnitPrice(1199, [toppings], { toppings: ['a', 'b', 'c', 'd', 'e'] })).toBe(1297)
  })

  it('ignores unknown choice ids', () => {
    expect(calculateUnitPrice(1199, [extras], { extras: ['gold-leaf'] })).toBe(1199)
  })
})

describe('calculateTotals', () => {
  it('sums lines, adds tip on the subtotal', () => {
    const totals = calculateTotals(
      [
        { unitPriceCents: 1199, quantity: 2 },
        { unitPriceCents: 399, quantity: 1 },
      ],
      { type: 'percent', value: 20 },
    )
    expect(totals).toEqual({ subtotalCents: 2797, tipCents: 559, totalCents: 3356 })
  })

  it('handles an empty cart', () => {
    expect(calculateTotals([], { type: 'percent', value: 15 })).toEqual({
      subtotalCents: 0,
      tipCents: 0,
      totalCents: 0,
    })
  })
})
