'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { MENU_ITEMS } from '@/data/menu'
import { cartLinesReducer, countItems, priceLines, type CartAction } from '@/lib/cart'
import { EMPTY_CART, loadCart, saveCart, type StoredCart } from '@/lib/cart-storage'
import { calculateTotals } from '@/lib/money'
import type { FulfillmentMethod, PricedLine, TipSelection, Totals } from '@/types/cart'
import type { SelectedOptions } from '@/types/menu'

type CartState = StoredCart & { isHydrated: boolean }

type Action =
  | CartAction
  | { type: 'hydrate'; cart: StoredCart }
  | { type: 'setFulfillment'; fulfillment: FulfillmentMethod }
  | { type: 'setTip'; tip: TipSelection }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'hydrate':
      return { ...action.cart, isHydrated: true }
    case 'setFulfillment':
      return { ...state, fulfillment: action.fulfillment }
    case 'setTip':
      return { ...state, tip: action.tip }
    default: {
      const lines = cartLinesReducer(state.lines, action)
      // Returning the same state object lets React skip re-rendering consumers.
      return lines === state.lines ? state : { ...state, lines }
    }
  }
}

export type CartContextValue = {
  lines: PricedLine[]
  itemCount: number
  totals: Totals
  fulfillment: FulfillmentMethod
  tip: TipSelection
  isHydrated: boolean
  isDrawerOpen: boolean
  addItem: (menuItemId: string, selectedOptions?: SelectedOptions) => { isFirstAdd: boolean }
  setQuantity: (key: string, quantity: number) => void
  removeLine: (key: string) => void
  clearCart: () => void
  setFulfillment: (fulfillment: FulfillmentMethod) => void
  setTip: (tip: TipSelection) => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

type Props = { children: ReactNode }

export function CartProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, { ...EMPTY_CART, isHydrated: false })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const hasAddedThisSession = useRef(false)

  // localStorage is only available after mount.
  useEffect(() => dispatch({ type: 'hydrate', cart: loadCart() }), [])

  useEffect(() => {
    if (!state.isHydrated) return
    saveCart({ lines: state.lines, fulfillment: state.fulfillment, tip: state.tip })
  }, [state])

  const addItem = useCallback((menuItemId: string, selectedOptions?: SelectedOptions) => {
    dispatch({ type: 'add', menuItemId, selectedOptions })
    const isFirstAdd = !hasAddedThisSession.current
    hasAddedThisSession.current = true
    if (isFirstAdd) setIsDrawerOpen(true)
    return { isFirstAdd }
  }, [])

  // Actions never change identity, so consumers can safely list them as effect dependencies.
  const actions = useMemo(
    () => ({
      addItem,
      setQuantity: (key: string, quantity: number) =>
        dispatch({ type: 'setQuantity', key, quantity }),
      removeLine: (key: string) => dispatch({ type: 'remove', key }),
      clearCart: () => dispatch({ type: 'clear' }),
      setFulfillment: (fulfillment: FulfillmentMethod) =>
        dispatch({ type: 'setFulfillment', fulfillment }),
      setTip: (tip: TipSelection) => dispatch({ type: 'setTip', tip }),
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
    }),
    [addItem],
  )

  const value = useMemo<CartContextValue>(() => {
    const lines = priceLines(state.lines, MENU_ITEMS)
    return {
      ...actions,
      lines,
      itemCount: countItems(lines),
      totals: calculateTotals(lines, state.tip),
      fulfillment: state.fulfillment,
      tip: state.tip,
      isHydrated: state.isHydrated,
      isDrawerOpen,
    }
  }, [state, isDrawerOpen, actions])

  return <CartContext value={value}>{children}</CartContext>
}
