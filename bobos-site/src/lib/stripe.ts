import { ROUTES } from '@/constants/routes'
import type { Totals } from '@/types/cart'

export type CheckoutSession = { id: string; url: string; amountTotalCents: number }

/**
 * Dummy stand-in for stripe.checkout.sessions.create(). Swap the body for the real
 * SDK (test mode, card 4242 4242 4242 4242) without changing callers.
 */
export async function createCheckoutSession(totals: Totals): Promise<CheckoutSession> {
  return {
    id: `cs_demo_${crypto.randomUUID()}`,
    url: `${ROUTES.orderSuccess}?demo=true`,
    amountTotalCents: totals.totalCents,
  }
}
