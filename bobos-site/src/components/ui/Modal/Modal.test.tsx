import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Modal } from '@/components/ui/Modal'

function Harness() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open cart</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Your cart"
        variant="drawer"
        footer={<button>Checkout</button>}
      >
        <p>Items</p>
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('opens as a labelled modal dialog and locks scroll', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open cart' }))
    const dialog = screen.getByRole('dialog', { name: 'Your cart' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('moves focus in and traps Tab inside', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open cart' }))
    const close = screen.getByRole('button', { name: 'Close' })
    const checkout = screen.getByRole('button', { name: 'Checkout' })
    expect(close).toHaveFocus()
    await user.tab()
    expect(checkout).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(checkout).toHaveFocus()
  })

  it('closes on Esc and returns focus to the opener', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open cart' })
    await user.click(opener)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes on the close button', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open cart' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
