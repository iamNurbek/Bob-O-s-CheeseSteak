import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PriceTag } from '@/components/ui/PriceTag'

describe('PriceTag', () => {
  it('formats cents', () => {
    render(<PriceTag cents={1399} />)
    expect(screen.getByText('$13.99')).toBeInTheDocument()
  })
})
