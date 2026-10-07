import { describe, expect, it } from 'vitest'

import { OPENING_HOURS } from '@/data/hours'
import { formatHoursRange, formatTime, summarizeHours } from '@/lib/hours'

describe('formatTime', () => {
  it.each([
    ['11:00', '11 AM'],
    ['12:00', '12 PM'],
    ['20:00', '8 PM'],
    ['00:00', '12 AM'],
    ['20:30', '8:30 PM'],
  ])('%s → %s', (input, output) => {
    expect(formatTime(input)).toBe(output)
  })
})

describe('formatHoursRange', () => {
  it('formats open and closed days', () => {
    expect(formatHoursRange({ day: 'Monday', open: '11:00', close: '20:00' })).toBe('11 AM – 8 PM')
    expect(formatHoursRange({ day: 'Monday', open: null, close: null })).toBe('Closed')
  })
})

describe('summarizeHours', () => {
  it('summarizes uniform hours', () => {
    expect(summarizeHours(OPENING_HOURS)).toBe('Open daily, 11 AM – 8 PM')
  })

  it('falls back when days differ', () => {
    const week = [...OPENING_HOURS.slice(1), { day: 'Sunday' as const, open: null, close: null }]
    expect(summarizeHours(week)).toBe('Hours vary by day')
  })
})
