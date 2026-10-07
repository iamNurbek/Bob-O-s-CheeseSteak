'use client'

import { Icon } from '@/components/ui/Icon'
import { useCart } from '@/hooks/useCart'

export function CartButton() {
  const { itemCount, openDrawer, isHydrated } = useCart()
  const count = isHydrated ? itemCount : 0

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-4 font-semibold text-on-primary hover:bg-primary-strong"
    >
      <Icon name="cart" />
      <span aria-hidden="true">Cart</span>
      <span
        aria-hidden="true"
        data-testid="cart-count"
        className="min-w-6 rounded-full bg-on-primary px-1.5 text-center text-sm text-primary tabular-nums"
      >
        {count}
      </span>
    </button>
  )
}
