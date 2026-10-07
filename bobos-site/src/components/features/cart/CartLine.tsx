import { QuantityStepper } from '@/components/features/cart/QuantityStepper'
import { PriceTag } from '@/components/ui/PriceTag'
import type { PricedLine } from '@/types/cart'

type Props = {
  line: PricedLine
  onQuantityChange: (key: string, quantity: number) => void
}

/** One cart row, shared by the drawer and the full cart page. */
export function CartLine({ line, onQuantityChange }: Props) {
  return (
    <li className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-bold">{line.name}</p>
          {line.optionSummary && <p className="text-sm text-muted">{line.optionSummary}</p>}
        </div>
        <PriceTag cents={line.lineTotalCents} />
      </div>
      <QuantityStepper
        itemName={line.name}
        quantity={line.quantity}
        onChange={(quantity) => onQuantityChange(line.key, quantity)}
      />
    </li>
  )
}
