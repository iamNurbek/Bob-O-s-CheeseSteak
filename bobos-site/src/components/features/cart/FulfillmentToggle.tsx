import { Toggle } from '@/components/ui/Toggle'
import type { FulfillmentMethod } from '@/types/cart'

const OPTIONS = [
  { value: 'pickup', label: 'Pickup' },
  { value: 'delivery', label: 'Delivery' },
] as const

type Props = {
  value: FulfillmentMethod
  onChange: (value: FulfillmentMethod) => void
}

export function FulfillmentToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Toggle legend="How do you want it?" options={OPTIONS} value={value} onChange={onChange} />
      <p className="text-sm text-muted">
        {value === 'pickup'
          ? 'Pick up at the counter on Main Street.'
          : 'Delivery is shown for the demo; no address is collected.'}
      </p>
    </div>
  )
}
