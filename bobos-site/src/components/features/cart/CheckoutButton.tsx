'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { requestCheckout } from '@/lib/checkout-client'

export function CheckoutButton() {
  const router = useRouter()
  const { lines, fulfillment, tip } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsSubmitting(true)
    setError(null)
    const result = await requestCheckout({
      lines: lines.map(({ menuItemId, quantity, selectedOptions }) => ({
        menuItemId,
        quantity,
        selectedOptions,
      })),
      fulfillment,
      tip,
    })
    if (result.ok) {
      router.push(result.url)
      return
    }
    setError(result.message)
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <Button size="lg" isFullWidth onClick={handleCheckout} disabled={isSubmitting}>
        {isSubmitting ? 'Starting checkout…' : 'Pay with Stripe (demo)'}
      </Button>
      <p className="text-center text-sm font-semibold text-accent-text">
        Demo only, no payment taken.
      </p>
      {error && (
        <p role="alert" className="text-center font-semibold text-primary">
          {error}
        </p>
      )}
    </div>
  )
}
