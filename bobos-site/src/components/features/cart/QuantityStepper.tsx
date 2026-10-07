import { Icon } from '@/components/ui/Icon'
import { MAX_LINE_QUANTITY } from '@/constants/limits'

type Props = {
  itemName: string
  quantity: number
  onChange: (quantity: number) => void
}

const STEP_CLASSES =
  'inline-flex size-11 items-center justify-center rounded-control border-2 border-border bg-surface hover:border-primary disabled:opacity-50'

export function QuantityStepper({ itemName, quantity, onChange }: Props) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Quantity of ${itemName}`}>
      <button
        type="button"
        className={STEP_CLASSES}
        onClick={() => onChange(quantity - 1)}
        aria-label={quantity === 1 ? `Remove ${itemName}` : `Decrease ${itemName}`}
      >
        <Icon name={quantity === 1 ? 'trash' : 'minus'} />
      </button>
      <output aria-live="polite" className="min-w-6 text-center font-bold tabular-nums">
        {quantity}
      </output>
      <button
        type="button"
        className={STEP_CLASSES}
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_LINE_QUANTITY}
        aria-label={`Increase ${itemName}`}
      >
        <Icon name="plus" />
      </button>
    </div>
  )
}
