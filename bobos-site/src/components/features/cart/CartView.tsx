'use client'

import { CartLine } from '@/components/features/cart/CartLine'
import { CheckoutButton } from '@/components/features/cart/CheckoutButton'
import { EmptyCart } from '@/components/features/cart/EmptyCart'
import { FulfillmentToggle } from '@/components/features/cart/FulfillmentToggle'
import { OrderSummary } from '@/components/features/cart/OrderSummary'
import { TipSelector } from '@/components/features/cart/TipSelector'
import { Card } from '@/components/ui/Card'
import { useCart } from '@/hooks/useCart'

export function CartView() {
  const cart = useCart()

  if (!cart.isHydrated) {
    return (
      <p role="status" className="py-12 text-muted">
        Loading your cart…
      </p>
    )
  }

  if (cart.lines.length === 0) return <EmptyCart />

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <Card as="section" aria-labelledby="cart-items-heading" className="lg:col-span-7">
        <h2 id="cart-items-heading" className="text-2xl font-extrabold">
          Items
        </h2>
        <ul>
          {cart.lines.map((line) => (
            <CartLine key={line.key} line={line} onQuantityChange={cart.setQuantity} />
          ))}
        </ul>
      </Card>
      <Card
        as="section"
        id="checkout"
        aria-labelledby="checkout-heading"
        className="flex scroll-mt-4 flex-col gap-6 lg:col-span-5"
      >
        <h2 id="checkout-heading" className="text-2xl font-extrabold">
          Checkout
        </h2>
        <FulfillmentToggle value={cart.fulfillment} onChange={cart.setFulfillment} />
        <TipSelector
          subtotalCents={cart.totals.subtotalCents}
          value={cart.tip}
          onChange={cart.setTip}
        />
        <OrderSummary totals={cart.totals} />
        <CheckoutButton />
      </Card>
    </div>
  )
}
