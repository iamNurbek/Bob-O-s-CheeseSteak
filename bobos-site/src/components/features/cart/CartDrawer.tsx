'use client'

import Link from 'next/link'

import { CartLine } from '@/components/features/cart/CartLine'
import { EmptyCart } from '@/components/features/cart/EmptyCart'
import { buttonVariants } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PriceTag } from '@/components/ui/PriceTag'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'

export function CartDrawer() {
  const { lines, totals, isDrawerOpen, closeDrawer, setQuantity } = useCart()
  const isEmpty = lines.length === 0

  const footer = isEmpty ? undefined : (
    <div className="flex flex-col gap-3">
      <p className="flex items-center justify-between text-lg font-bold">
        <span>Subtotal</span>
        <PriceTag cents={totals.subtotalCents} />
      </p>
      <Link
        href={`${ROUTES.cart}#checkout`}
        onClick={closeDrawer}
        className={buttonVariants({ isFullWidth: true, size: 'lg' })}
      >
        Checkout
      </Link>
      <Link
        href={ROUTES.cart}
        onClick={closeDrawer}
        className={buttonVariants({ variant: 'secondary', isFullWidth: true })}
      >
        View full cart
      </Link>
    </div>
  )

  return (
    <Modal
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title="Your cart"
      variant="drawer"
      footer={footer}
    >
      {isEmpty ? (
        <EmptyCart onNavigate={closeDrawer} />
      ) : (
        <ul aria-label="Cart items">
          {lines.map((line) => (
            <CartLine key={line.key} line={line} onQuantityChange={setQuantity} />
          ))}
        </ul>
      )}
    </Modal>
  )
}
