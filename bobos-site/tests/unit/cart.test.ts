import { describe, expect, it } from 'vitest'

import { MAX_LINE_QUANTITY } from '@/constants/limits'
import { MENU_ITEMS } from '@/data/menu'
import { cartLinesReducer, clampQuantity, countItems, createLineKey, priceLines } from '@/lib/cart'
import type { CartLine } from '@/types/cart'

const add = (lines: CartLine[], menuItemId: string, selectedOptions?: Record<string, string[]>) =>
  cartLinesReducer(lines, { type: 'add', menuItemId, selectedOptions })

describe('createLineKey', () => {
  it('ignores option order and empty groups', () => {
    expect(createLineKey('x', { b: ['2', '1'], a: ['z'], c: [] })).toBe(
      createLineKey('x', { a: ['z'], b: ['1', '2'] }),
    )
    expect(createLineKey('x')).toBe('x')
  })
})

describe('clampQuantity', () => {
  it('keeps quantity within 0..max', () => {
    expect(clampQuantity(-3)).toBe(0)
    expect(clampQuantity(2.7)).toBe(2)
    expect(clampQuantity(999)).toBe(MAX_LINE_QUANTITY)
    expect(clampQuantity(Number.NaN)).toBe(0)
  })
})

describe('cartLinesReducer', () => {
  it('merges identical items and keeps different options apart', () => {
    let lines = add([], 'the-bob-o')
    lines = add(lines, 'the-bob-o')
    lines = add(lines, 'the-bob-o', { extras: ['extra-meat'] })
    expect(lines).toHaveLength(2)
    expect(lines[0].quantity).toBe(2)
    expect(countItems(lines)).toBe(3)
  })

  it('sets quantity, and 0 removes the line', () => {
    const lines = add([], 'shake', { flavor: ['vanilla'] })
    const key = lines[0].key
    expect(cartLinesReducer(lines, { type: 'setQuantity', key, quantity: 4 })[0].quantity).toBe(4)
    expect(cartLinesReducer(lines, { type: 'setQuantity', key, quantity: 0 })).toEqual([])
  })

  it('returns the same array when clearing an empty cart (no needless re-render)', () => {
    const empty: CartLine[] = []
    expect(cartLinesReducer(empty, { type: 'clear' })).toBe(empty)
  })

  it('removes, clears and replaces', () => {
    const lines = add(add([], 'french-fries'), 'onion-rings')
    expect(cartLinesReducer(lines, { type: 'remove', key: 'french-fries' })).toHaveLength(1)
    expect(cartLinesReducer(lines, { type: 'clear' })).toEqual([])
    expect(cartLinesReducer([], { type: 'replace', lines })).toBe(lines)
  })
})

describe('priceLines', () => {
  it('prices options from the menu and drops unknown items', () => {
    const lines = [
      ...add([], 'build-your-own', {
        protein: ['steak'],
        cheese: ['american'],
        toppings: ['grilled-onions', 'mushrooms', 'tomatoes', 'lettuce'],
        extras: ['extra-cheese'],
      }),
      { key: 'ghost', menuItemId: 'ghost', quantity: 1 },
    ]
    const [line, ...rest] = priceLines(lines, MENU_ITEMS)
    expect(rest).toHaveLength(0)
    expect(line.unitPriceCents).toBe(1199 + 49 + 99)
    expect(line.lineTotalCents).toBe(1347)
    expect(line.optionSummary).toContain('Steak · American')
  })
})
