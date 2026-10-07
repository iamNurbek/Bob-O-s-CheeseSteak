import type { Metadata } from 'next'

import { ClearCartOnMount } from '@/components/features/cart/ClearCartOnMount'
import { StatusPage } from '@/components/layout/StatusPage'
import { Badge } from '@/components/ui/Badge'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = { title: 'Order received', robots: { index: false } }

export default function OrderSuccessPage() {
  return (
    <StatusPage
      title="Order received!"
      body="Thanks for trying the demo. In a real order, the griddle would already be firing up."
      primary={{ href: ROUTES.menu, label: 'Back to the menu' }}
      secondary={{ href: ROUTES.home, label: 'Home' }}
    >
      <Badge>Demo only, no payment taken</Badge>
      <ClearCartOnMount />
    </StatusPage>
  )
}
