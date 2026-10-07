import { render, screen } from '@testing-library/react'
import { useEffect, useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CartButton } from '@/components/features/cart/CartButton'
import { ClearCartOnMount } from '@/components/features/cart/ClearCartOnMount'
import { useCart } from '@/hooks/useCart'
import { CartProvider } from '@/providers/CartProvider'

const seedCart = () =>
  window.localStorage.setItem(
    'bobos-cart-v1',
    JSON.stringify({
      lines: [{ key: 'french-fries', menuItemId: 'french-fries', quantity: 2 }],
      fulfillment: 'pickup',
      tip: { type: 'percent', value: 20 },
    }),
  )

describe('ClearCartOnMount', () => {
  // Regression: an unstable clearCart made this effect loop ("Maximum update depth exceeded").
  it('empties the cart once without an update loop', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    seedCart()
    render(
      <CartProvider>
        <CartButton />
        <ClearCartOnMount />
      </CartProvider>,
    )
    expect(await screen.findByRole('button', { name: 'Cart, 0 items' })).toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalled()
  })
})

describe('CartProvider actions', () => {
  it('keep the same identity when cart state changes', async () => {
    const seen = new Set<unknown>()
    function Probe() {
      const { clearCart, addItem, setQuantity, isHydrated } = useCart()
      seen.add(clearCart).add(addItem).add(setQuantity)
      const hasAdded = useRef(false)
      useEffect(() => {
        if (!isHydrated || hasAdded.current) return
        hasAdded.current = true
        addItem('french-fries')
      }, [isHydrated, addItem])
      return null
    }
    render(
      <CartProvider>
        <Probe />
        <CartButton />
      </CartProvider>,
    )
    expect(await screen.findByRole('button', { name: 'Cart, 1 item' })).toBeInTheDocument()
    expect(seen.size).toBe(3)
  })
})
