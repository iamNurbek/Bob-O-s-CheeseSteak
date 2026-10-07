'use client'

import { useEffect } from 'react'

import { useCart } from '@/hooks/useCart'

/** The demo order is "placed", so the success page empties the cart once it has loaded. */
export function ClearCartOnMount() {
  const { isHydrated, clearCart } = useCart()
  useEffect(() => {
    if (isHydrated) clearCart()
  }, [isHydrated, clearCart])
  return null
}
