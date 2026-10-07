import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Toggle } from '@/components/ui/Toggle'

const OPTIONS = [
  { value: 'delivery', label: 'Delivery' },
  { value: 'pickup', label: 'Pickup' },
] as const

function Harness() {
  const [value, setValue] = useState<'delivery' | 'pickup'>('delivery')
  return <Toggle legend="Fulfillment" options={OPTIONS} value={value} onChange={setValue} />
}

describe('Toggle', () => {
  it('is a labelled radio group', () => {
    render(<Harness />)
    expect(screen.getByRole('group', { name: 'Fulfillment' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Delivery' })).toBeChecked()
  })

  it('changes on click and with arrow keys', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('radio', { name: 'Pickup' }))
    expect(screen.getByRole('radio', { name: 'Pickup' })).toBeChecked()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Delivery' })).toBeChecked()
  })
})
