import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CartButton } from '@/components/features/cart/CartButton'
import { CartDrawer } from '@/components/features/cart/CartDrawer'
import { AddToCartControls } from '@/components/features/menu/AddToCartControls'
import { findMenuItem } from '@/data/menu'
import { CartProvider } from '@/providers/CartProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import type { MenuItem } from '@/types/menu'

const bobO = findMenuItem('the-bob-o') as MenuItem
const byo = findMenuItem('build-your-own') as MenuItem

function renderShop() {
  return render(
    <ToastProvider>
      <CartProvider>
        <CartButton />
        <AddToCartControls item={bobO} />
        <AddToCartControls item={byo} />
        <CartDrawer />
      </CartProvider>
    </ToastProvider>,
  )
}

describe('Cart drawer', () => {
  it('opens on the first add, updates count and subtotal, and closes with Esc', async () => {
    const user = userEvent.setup()
    renderShop()
    await user.click(screen.getByRole('button', { name: 'Add The Bob-O to cart' }))
    const drawer = screen.getByRole('dialog', { name: 'Your cart' })
    expect(within(drawer).getByText('The Bob-O')).toBeInTheDocument()
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')

    await user.click(within(drawer).getByRole('button', { name: 'Increase The Bob-O' }))
    expect(within(drawer).getByText('Subtotal').parentElement).toHaveTextContent('$23.98')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not reopen on later adds and shows a toast instead', async () => {
    const user = userEvent.setup()
    renderShop()
    const add = screen.getByRole('button', { name: 'Add The Bob-O to cart' })
    await user.click(add)
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.click(add)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Added The Bob-O to your cart')
  })

  it('shows the empty state with a link to the menu', async () => {
    const user = userEvent.setup()
    renderShop()
    await user.click(screen.getByRole('button', { name: /^Cart, 0 items/ }))
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse the menu' })).toHaveAttribute('href', '/menu')
  })

  it('requires Build Your Own choices before adding', async () => {
    const user = userEvent.setup()
    renderShop()
    await user.click(screen.getByRole('button', { name: 'Choose options for Build Your Own' }))
    const dialog = screen.getByRole('dialog', { name: 'Build Your Own' })
    await user.click(within(dialog).getByRole('button', { name: /Add to cart/ }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Please finish')

    await user.click(within(dialog).getByRole('radio', { name: 'Chicken' }))
    await user.click(within(dialog).getByRole('radio', { name: 'Provolone' }))
    for (const topping of [
      'Mushrooms',
      'Grilled Onions',
      'Sliced Tomatoes',
      'Hot Cherry Peppers',
    ]) {
      await user.click(within(dialog).getByRole('checkbox', { name: topping }))
    }
    await user.click(within(dialog).getByRole('button', { name: 'Add to cart · $12.48' }))

    const drawer = screen.getByRole('dialog', { name: 'Your cart' })
    expect(within(drawer).getByText(/Chicken · Provolone/)).toBeInTheDocument()
  })

  it('restores the cart from localStorage', async () => {
    window.localStorage.setItem(
      'bobos-cart-v1',
      JSON.stringify({
        lines: [{ key: 'french-fries', menuItemId: 'french-fries', quantity: 3 }],
        fulfillment: 'pickup',
        tip: { type: 'percent', value: 20 },
      }),
    )
    renderShop()
    expect(await screen.findByRole('button', { name: 'Cart, 3 items' })).toBeInTheDocument()
  })
})
