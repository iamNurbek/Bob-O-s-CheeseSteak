import { describe, expect, it } from 'vitest'

import { cn } from '@/lib/cn'

describe('cn', () => {
  it('joins truthy classes and drops falsy ones', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b')
  })

  it('lets the later Tailwind class win', () => {
    expect(cn('p-2 bg-surface', 'p-4')).toBe('bg-surface p-4')
  })

  it('keeps token colors and font sizes side by side', () => {
    expect(cn('text-sm text-muted')).toBe('text-sm text-muted')
  })
})
