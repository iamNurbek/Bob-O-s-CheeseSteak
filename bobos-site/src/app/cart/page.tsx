import type { Metadata } from 'next'

import { CartView } from '@/components/features/cart/CartView'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'

export const metadata: Metadata = { title: 'Cart', robots: { index: false } }

export default function CartPage() {
  return (
    <Container className="py-12">
      <SectionHeading as="h1" title="Your cart" />
      <CartView />
    </Container>
  )
}
