import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

describe('ImagePlaceholder', () => {
  it('is hidden from assistive tech and keeps a 4:3 box', () => {
    const { container } = render(<ImagePlaceholder label="The Bob-O" />)
    const box = container.firstElementChild
    expect(box).toHaveAttribute('aria-hidden', 'true')
    expect(box).toHaveClass('aspect-[4/3]', 'bg-surface-alt')
  })
})
