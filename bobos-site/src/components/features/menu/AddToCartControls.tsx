'use client'

import { useState } from 'react'

import { ItemOptionsModal } from '@/components/features/menu/ItemOptionsModal'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { hasRequiredOptions } from '@/lib/menu-options'
import { useToast } from '@/providers/ToastProvider'
import type { MenuItem, SelectedOptions } from '@/types/menu'

type Props = { item: MenuItem }

/** "Add" adds straight away unless a choice is required; "Customize" opens the options. */
export function AddToCartControls({ item }: Props) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const needsChoices = hasRequiredOptions(item)
  const hasOptionalChoices = !needsChoices && (item.options?.length ?? 0) > 0

  const add = (selected?: SelectedOptions) => {
    const { isFirstAdd } = addItem(item.id, selected)
    if (!isFirstAdd) showToast(`Added ${item.name} to your cart`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => (needsChoices ? setIsOptionsOpen(true) : add())}
        aria-label={needsChoices ? `Choose options for ${item.name}` : `Add ${item.name} to cart`}
        aria-haspopup={needsChoices ? 'dialog' : undefined}
      >
        {needsChoices ? 'Choose & add' : 'Add'}
      </Button>
      {hasOptionalChoices && (
        <Button
          variant="ghost"
          onClick={() => setIsOptionsOpen(true)}
          aria-label={`Customize ${item.name}`}
          aria-haspopup="dialog"
        >
          Customize
        </Button>
      )}
      {item.options && (
        <ItemOptionsModal
          item={item}
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
          onAdd={add}
        />
      )}
    </div>
  )
}
