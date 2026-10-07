import { describe, expect, it } from 'vitest'

import { findMenuItem } from '@/data/menu'
import {
  describeGroupRule,
  hasRequiredOptions,
  summarizeSelection,
  toggleChoice,
  validateSelection,
} from '@/lib/menu-options'
import type { MenuItem } from '@/types/menu'

const byo = findMenuItem('build-your-own') as MenuItem
const groups = byo.options ?? []
const toppings = groups.find((g) => g.id === 'toppings')!

const valid = {
  protein: ['chicken'],
  cheese: ['swiss'],
  toppings: ['mushrooms', 'tomatoes', 'lettuce'],
}

describe('hasRequiredOptions', () => {
  it('is true for BYO and shakes, false for signature steaks and fries', () => {
    expect(hasRequiredOptions(byo)).toBe(true)
    expect(hasRequiredOptions(findMenuItem('shake')!)).toBe(true)
    expect(hasRequiredOptions(findMenuItem('the-bob-o')!)).toBe(false)
    expect(hasRequiredOptions(findMenuItem('french-fries')!)).toBe(false)
  })
})

describe('describeGroupRule', () => {
  it('describes each kind of group', () => {
    expect(describeGroupRule(groups[0])).toBe('Choose 1')
    expect(describeGroupRule(toppings)).toBe('Choose 3 (up to 7)')
    expect(describeGroupRule(groups[3])).toBe('Optional, up to 2')
  })
})

describe('validateSelection', () => {
  it('accepts a complete BYO', () => {
    expect(validateSelection(groups, valid)).toEqual({})
  })

  it('requires exactly the minimum toppings', () => {
    expect(validateSelection(groups, { ...valid, toppings: ['mushrooms'] })).toHaveProperty(
      'toppings',
    )
  })

  it('rejects unknown groups, unknown choices and duplicates', () => {
    expect(validateSelection(groups, { ...valid, sauce: ['x'] })).toHaveProperty('sauce')
    expect(validateSelection(groups, { ...valid, cheese: ['gold'] })).toHaveProperty('cheese')
    expect(
      validateSelection(groups, { ...valid, toppings: ['mushrooms', 'mushrooms', 'lettuce'] }),
    ).toHaveProperty('toppings')
  })
})

describe('toggleChoice', () => {
  it('replaces in single-choice groups', () => {
    expect(toggleChoice(groups[0], { protein: ['steak'] }, 'chicken')).toEqual({
      protein: ['chicken'],
    })
  })

  it('adds, removes and respects the max', () => {
    let selected = toggleChoice(toppings, {}, 'mushrooms')
    expect(selected.toppings).toEqual(['mushrooms'])
    selected = toggleChoice(toppings, selected, 'mushrooms')
    expect(selected.toppings).toEqual([])
    const full = { toppings: toppings.choices.map((c) => c.id) }
    expect(toggleChoice({ ...toppings, maxSelected: 7 }, full, 'x')).toBe(full)
  })
})

describe('summarizeSelection', () => {
  it('lists chosen labels in group order', () => {
    expect(summarizeSelection(groups, valid)).toBe(
      'Chicken · Swiss · Mushrooms, Shredded Lettuce, Sliced Tomatoes',
    )
  })
})
