import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Chip } from '@/components/ui/Chip'

describe('Chip', () => {
  it('styles the selected state', () => {
    render(
      <>
        <Chip isSelected>Salads</Chip>
        <Chip>Sides</Chip>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Salads' })).toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: 'Sides' })).toHaveClass('bg-surface')
  })
})
