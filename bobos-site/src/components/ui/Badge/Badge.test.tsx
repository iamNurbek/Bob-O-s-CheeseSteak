import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('uses dark text on the accent (never white on orange)', () => {
    render(<Badge>Favorite</Badge>)
    expect(screen.getByText('Favorite')).toHaveClass('bg-accent', 'text-on-accent')
  })
})
