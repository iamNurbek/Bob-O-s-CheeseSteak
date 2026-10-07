'use client'

import { useState } from 'react'

import { OptionGroupFieldset } from '@/components/features/menu/OptionGroupFieldset'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { toggleChoice, validateSelection } from '@/lib/menu-options'
import { calculateUnitPrice, formatPrice } from '@/lib/money'
import type { MenuItem, SelectedOptions } from '@/types/menu'

type Props = {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  onAdd: (selected: SelectedOptions) => void
}

/** Options dialog; Build Your Own uses it to enforce steak/chicken, a cheese and 3 toppings. */
export function ItemOptionsModal({ item, isOpen, onClose, onAdd }: Props) {
  const groups = item.options ?? []
  const [selected, setSelected] = useState<SelectedOptions>({})
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false)

  const errors = validateSelection(groups, selected)
  const isValid = Object.keys(errors).length === 0
  const price = calculateUnitPrice(item.priceCents, groups, selected)

  const handleClose = () => {
    setSelected({})
    setHasTriedSubmit(false)
    onClose()
  }

  const handleAdd = () => {
    setHasTriedSubmit(true)
    if (!isValid) return
    onAdd(selected)
    handleClose()
  }

  const footer = (
    <div className="flex flex-col gap-2">
      {hasTriedSubmit && !isValid && (
        <p role="alert" className="text-sm font-semibold text-primary">
          Please finish the highlighted choices.
        </p>
      )}
      <Button size="lg" isFullWidth onClick={handleAdd}>
        Add to cart · {formatPrice(price)}
      </Button>
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={item.name} footer={footer}>
      <p className="mb-6 text-muted">{item.description}</p>
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <OptionGroupFieldset
            key={group.id}
            group={group}
            selectedIds={selected[group.id] ?? []}
            error={hasTriedSubmit ? errors[group.id] : undefined}
            onToggle={(choiceId) => setSelected((prev) => toggleChoice(group, prev, choiceId))}
          />
        ))}
      </div>
    </Modal>
  )
}
