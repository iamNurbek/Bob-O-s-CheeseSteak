import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { OrderSummary } from '@/components/features/cart/OrderSummary'
import { TipSelector } from '@/components/features/cart/TipSelector'
import { calculateTotals } from '@/lib/money'
import type { TipSelection } from '@/types/cart'

const SUBTOTAL = 1199

function Harness() {
  const [tip, setTip] = useState<TipSelection>({ type: 'percent', value: 20 })
  const totals = calculateTotals([{ unitPriceCents: SUBTOTAL, quantity: 1 }], tip)
  return (
    <>
      <TipSelector subtotalCents={SUBTOTAL} value={tip} onChange={setTip} />
      <OrderSummary totals={totals} />
    </>
  )
}

describe('TipSelector', () => {
  it('updates the total when a percentage is chosen', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    expect(screen.getByTestId('order-total')).toHaveTextContent('$14.39')
    await user.click(screen.getByRole('radio', { name: /15%/ }))
    expect(screen.getByTestId('tip-amount')).toHaveTextContent('$1.80')
    expect(screen.getByTestId('order-total')).toHaveTextContent('$13.79')
  })

  it('accepts a custom dollar tip and clamps it', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('radio', { name: 'Custom' }))
    const input = screen.getByLabelText('Custom tip (dollars)')
    await user.type(input, '3.5')
    expect(screen.getByTestId('tip-amount')).toHaveTextContent('$3.50')
    await user.clear(input)
    await user.type(input, '500')
    expect(screen.getByTestId('tip-amount')).toHaveTextContent('$100.00')
    expect(input).toBeInvalid()
  })
})
