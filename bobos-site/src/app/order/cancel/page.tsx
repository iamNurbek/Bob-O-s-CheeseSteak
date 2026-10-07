import type { Metadata } from 'next'

import { StatusPage } from '@/components/layout/StatusPage'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = { title: 'Checkout canceled', robots: { index: false } }

export default function OrderCancelPage() {
  return (
    <StatusPage
      title="Checkout canceled"
      body="No worries, your cart is saved. Head back whenever you're ready."
      primary={{ href: ROUTES.cart, label: 'Return to cart' }}
      secondary={{ href: ROUTES.menu, label: 'Keep browsing' }}
    />
  )
}
