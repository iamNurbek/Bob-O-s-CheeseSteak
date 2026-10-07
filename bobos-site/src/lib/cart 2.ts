import { MAX_CART_LINES, MAX_LINE_QUANTITY } from '@/constants/limits'
import { summarizeSelection } from '@/lib/menu-options'
import { calculateLineTotal, calculateUnitPrice } from '@/lib/money'
import type { CartLine, PricedLine } from '@/types/cart'
import type { MenuItem, SelectedOptions } from '@/types/menu'

/** Same item with the same options (in any order) shares one line. */
export function createLineKey(menuItemId: string, selected: SelectedOptions = {}): string {
  const normalized = Object.keys(selected)
    .filter((groupId) => selected[groupId].length > 0)
    .sort()
    .map((groupId) => `${groupId}=${[...selected[groupId]].sort().join('+')}`)
    .join('&')
  return normalized ? `${menuItemId}?${normalized}` : menuItemId
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0
  return Math.min(Math.max(Math.trunc(quantity), 0), MAX_LINE_QUANTITY)
}

export type CartAction =
  | { type: 'add'; menuItemId: string; selectedOptions?: SelectedOptions; quantity?: number }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'replace'; lines: CartLine[] }

function addLine(lines: CartLine[], action: Extract<CartAction, { type: 'add' }>): CartLine[] {
  const key = createLineKey(action.menuItemId, action.selectedOptions)
  const addQuantity = action.quantity ?? 1
  const existing = lines.find((line) => line.key === key)
  if (existing) {
    return lines.map((line) =>
      line.key === key ? { ...line, quantity: clampQuantity(line.quantity + addQuantity) } : line,
    )
  }
  if (lines.length >= MAX_CART_LINES) return lines
  const line: CartLine = {
    key,
    menuItemId: action.menuItemId,
    quantity: clampQuantity(addQuantity),
    selectedOptions: action.selectedOptions,
  }
  return [...lines, line]
}

/** Pure cart line reducer; quantity 0 removes the line. */
export function cartLinesReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add':
      return addLine(lines, action)
    case 'setQuantity': {
      const quantity = clampQuantity(action.quantity)
      if (quantity === 0) return lines.filter((line) => line.key !== action.key)
      return lines.map((line) => (line.key === action.key ? { ...line, quantity } : line))
    }
    case 'remove':
      return lines.filter((line) => line.key !== action.key)
    case 'clear':
      return lines.length === 0 ? lines : []
    case 'replace':
      return action.lines
  }
}

/** Attaches names and prices from the menu; drops lines whose item no longer exists. */
export function priceLines(lines: CartLine[], menu: MenuItem[]): PricedLine[] {
  return lines.flatMap((line) => {
    const item = menu.find((candidate) => candidate.id === line.menuItemId)
    if (!item || !item.isAvailable) return []
    const unitPriceCents = calculateUnitPrice(item.priceCents, item.options, line.selectedOptions)
    return [
      {
        ...line,
        name: item.name,
        optionSummary: summarizeSelection(item.options, line.selectedOptions),
        unitPriceCents,
        lineTotalCents: calculateLineTotal(unitPriceCents, line.quantity),
      },
    ]
  })
}

export function countItems(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}
