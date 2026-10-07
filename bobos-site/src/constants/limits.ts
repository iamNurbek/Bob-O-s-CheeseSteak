import type { TipPercent } from '@/types/cart'

export const TIP_PERCENT_OPTIONS: readonly TipPercent[] = [15, 20, 25]
export const DEFAULT_TIP_PERCENT: TipPercent = 20
export const MAX_CUSTOM_TIP_CENTS = 100_00
export const MAX_LINE_QUANTITY = 20
export const MAX_CART_LINES = 50
export const CART_STORAGE_KEY = 'bobos-cart-v1'
