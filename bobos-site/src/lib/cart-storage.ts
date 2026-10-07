import { z } from 'zod'

import { CART_STORAGE_KEY, DEFAULT_TIP_PERCENT } from '@/constants/limits'
import { fulfillmentSchema, storedCartLineSchema, tipSelectionSchema } from '@/lib/validation'
import type { CartLine, FulfillmentMethod, TipSelection } from '@/types/cart'

export type StoredCart = {
  lines: CartLine[]
  fulfillment: FulfillmentMethod
  tip: TipSelection
}

export const EMPTY_CART: StoredCart = {
  lines: [],
  fulfillment: 'pickup',
  tip: { type: 'percent', value: DEFAULT_TIP_PERCENT },
}

const storedCartSchema = z.object({
  lines: z.array(storedCartLineSchema),
  fulfillment: fulfillmentSchema,
  tip: tipSelectionSchema,
})

/** Reads the saved cart; anything missing, corrupt or blocked yields an empty cart. */
export function loadCart(): StoredCart {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return EMPTY_CART
    const parsed = storedCartSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : EMPTY_CART
  } catch {
    return EMPTY_CART
  }
}

export function saveCart(cart: StoredCart): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Storage can be full or blocked (private mode); the cart still works in memory.
  }
}
