import { API_ROUTES } from '@/constants/routes'
import type { CheckoutRequest } from '@/lib/validation'

type CheckoutResult = { ok: true; url: string } | { ok: false; message: string }

/** Calls the dummy checkout route and normalizes every failure into a message. */
export async function requestCheckout(body: CheckoutRequest): Promise<CheckoutResult> {
  try {
    const response = await fetch(API_ROUTES.checkout, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data: unknown = await response.json()
    if (response.ok && typeof data === 'object' && data && 'url' in data) {
      return { ok: true, url: String(data.url) }
    }
    const message =
      typeof data === 'object' && data && 'error' in data ? String(data.error) : undefined
    return { ok: false, message: message ?? 'Checkout failed. Please try again.' }
  } catch {
    return { ok: false, message: 'Network error. Check your connection and try again.' }
  }
}
