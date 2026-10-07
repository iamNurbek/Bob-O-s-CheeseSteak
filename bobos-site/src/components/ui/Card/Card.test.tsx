import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from '@/components/ui/Card'

describe('Card', () => {
  it('renders the requested element with surface styling', () => {
    render(<Card as="article">Hours</Card>)
    const card = screen.getByRole('article')
    expect(card).toHaveTextContent('Hours')
    expect(card).toHaveClass('bg-surface', 'rounded-card')
  })
})
