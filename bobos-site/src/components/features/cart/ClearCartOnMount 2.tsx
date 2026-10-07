'use client'

import { useEffect, useRef } from 'react'

import { useCart } from '@/hooks/useCart'

/** The demo order is "placed", so the success page empties the cart exactly once. */
export function ClearCartOnMount() {
  const { isHydrated, clearCart } = useCart()
  const hasCleared = useRef(false)

  useEffect(() => {
    if (!isHydrated || hasCleared.current) return
    hasCleared.current = true
    clearCart()
  }, [isHydrated, clearCart])

  return null
}
