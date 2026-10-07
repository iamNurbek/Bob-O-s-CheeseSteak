import { MAX_CUSTOM_TIP_CENTS } from '@/constants/limits'
import type { TipSelection, Totals } from '@/types/cart'
import type { OptionGroup, SelectedOptions } from '@/types/menu'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** Converts a dollar amount (e.g. 11.99) to integer cents, rounding once. */
export function toCents(dollars: number): number {
  if (!Number.isFinite(dollars)) return 0
  return Math.round(dollars * 100)
}

/** Formats integer cents as US dollars, e.g. 1199 → "$11.99". */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100)
}

/** Keeps a custom tip between $0 and MAX_CUSTOM_TIP_CENTS. */
export function clampTipCents(cents: number): number {
  if (!Number.isFinite(cents)) return 0
  return Math.min(Math.max(Math.round(cents), 0), MAX_CUSTOM_TIP_CENTS)
}

/** Tip on the subtotal: percentages round once to the nearest cent. */
export function calculateTipCents(subtotalCents: number, tip: TipSelection): number {
  if (tip.type === 'custom') return clampTipCents(tip.cents)
  return Math.round((subtotalCents * tip.value) / 100)
}

/** Price of one item with its chosen options (deltas plus extra-choice charges). */
export function calculateUnitPrice(
  basePriceCents: number,
  groups: OptionGroup[] = [],
  selected: SelectedOptions = {},
): number {
  return groups.reduce((total, group) => {
    const chosenIds = selected[group.id] ?? []
    const deltas = group.choices
      .filter((choice) => chosenIds.includes(choice.id))
      .reduce((sum, choice) => sum + choice.priceDeltaCents, 0)
    const extraCount = Math.max(0, chosenIds.length - (group.includedCount ?? chosenIds.length))
    return total + deltas + extraCount * (group.extraChoiceCents ?? 0)
  }, basePriceCents)
}

export function calculateLineTotal(unitPriceCents: number, quantity: number): number {
  return unitPriceCents * quantity
}

type PricedQuantity = { unitPriceCents: number; quantity: number }

/** The one place subtotal, tip and total are computed (client and server). */
export function calculateTotals(lines: PricedQuantity[], tip: TipSelection): Totals {
  const subtotalCents = lines.reduce(
    (sum, line) => sum + calculateLineTotal(line.unitPriceCents, line.quantity),
    0,
  )
  const tipCents = calculateTipCents(subtotalCents, tip)
  return { subtotalCents, tipCents, totalCents: subtotalCents + tipCents }
}
