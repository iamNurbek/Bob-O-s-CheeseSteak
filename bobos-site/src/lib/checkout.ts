import { MENU_ITEMS } from '@/data/menu'
import { priceLines, createLineKey } from '@/lib/cart'
import { validateSelection } from '@/lib/menu-options'
import { calculateTotals } from '@/lib/money'
import type { CheckoutRequest } from '@/lib/validation'
import type { Totals } from '@/types/cart'

type PriceResult = { ok: true; totals: Totals } | { ok: false; error: string }

/** Server-side source of truth: prices come from the menu, never from the client. */
export function priceCheckout(request: CheckoutRequest): PriceResult {
  for (const line of request.lines) {
    const item = MENU_ITEMS.find((candidate) => candidate.id === line.menuItemId)
    if (!item || !item.isAvailable) {
      return { ok: false, error: `Item "${line.menuItemId}" is not on the menu.` }
    }
    const errors = validateSelection(item.options, line.selectedOptions)
    if (Object.keys(errors).length > 0) {
      return { ok: false, error: `Options for ${item.name} are incomplete or invalid.` }
    }
  }
  const lines = request.lines.map((line) => ({
    ...line,
    key: createLineKey(line.menuItemId, line.selectedOptions),
  }))
  return { ok: true, totals: calculateTotals(priceLines(lines, MENU_ITEMS), request.tip) }
}
