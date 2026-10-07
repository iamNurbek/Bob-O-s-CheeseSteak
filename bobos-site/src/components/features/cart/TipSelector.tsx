'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { MAX_CUSTOM_TIP_CENTS, TIP_PERCENT_OPTIONS } from '@/constants/limits'
import { calculateTipCents, clampTipCents, formatPrice, toCents } from '@/lib/money'
import type { TipPercent, TipSelection } from '@/types/cart'

type TipOptionValue = `${TipPercent}` | 'custom'

type Props = {
  subtotalCents: number
  value: TipSelection
  onChange: (tip: TipSelection) => void
}

function toOptionValue(tip: TipSelection): TipOptionValue {
  return tip.type === 'custom' ? 'custom' : (`${tip.value}` as TipOptionValue)
}

/** Tip on the subtotal: 15/20/25% or a custom dollar amount. */
export function TipSelector({ subtotalCents, value, onChange }: Props) {
  const [customText, setCustomText] = useState(
    value.type === 'custom' ? (value.cents / 100).toFixed(2) : '',
  )

  const options = [
    ...TIP_PERCENT_OPTIONS.map((percent) => ({
      value: `${percent}` as TipOptionValue,
      label: `${percent}% · ${formatPrice(calculateTipCents(subtotalCents, { type: 'percent', value: percent }))}`,
    })),
    { value: 'custom' as TipOptionValue, label: 'Custom' },
  ]

  const handleOptionChange = (option: TipOptionValue) => {
    if (option === 'custom') {
      onChange({ type: 'custom', cents: clampTipCents(toCents(Number(customText) || 0)) })
      return
    }
    onChange({ type: 'percent', value: Number(option) as TipPercent })
  }

  const handleCustomChange = (text: string) => {
    setCustomText(text)
    onChange({ type: 'custom', cents: clampTipCents(toCents(Number(text) || 0)) })
  }

  const isOverMax =
    value.type === 'custom' && toCents(Number(customText) || 0) > MAX_CUSTOM_TIP_CENTS

  return (
    <div className="flex flex-col gap-4">
      <Toggle
        legend="Add a tip"
        options={options}
        value={toOptionValue(value)}
        onChange={handleOptionChange}
      />
      {value.type === 'custom' && (
        <Input
          label="Custom tip (dollars)"
          type="number"
          inputMode="decimal"
          min={0}
          max={MAX_CUSTOM_TIP_CENTS / 100}
          step="0.01"
          value={customText}
          onChange={(event) => handleCustomChange(event.target.value)}
          hint={`Between $0 and ${formatPrice(MAX_CUSTOM_TIP_CENTS)}.`}
          error={isOverMax ? `Tips are capped at ${formatPrice(MAX_CUSTOM_TIP_CENTS)}.` : undefined}
          className="max-w-48"
        />
      )}
    </div>
  )
}
