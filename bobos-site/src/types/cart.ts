import type { SelectedOptions } from '@/types/menu'

export type CartLine = {
  /** Stable key: same item + same options = same line. */
  key: string
  menuItemId: string
  quantity: number
  selectedOptions?: SelectedOptions
}

export type FulfillmentMethod = 'delivery' | 'pickup'

export type TipPercent = 15 | 20 | 25

export type TipSelection =
  { type: 'percent'; value: TipPercent } | { type: 'custom'; cents: number }

export type Totals = {
  subtotalCents: number
  tipCents: number
  totalCents: number
}

export type PricedLine = CartLine & {
  name: string
  optionSummary: string
  unitPriceCents: number
  lineTotalCents: number
}
