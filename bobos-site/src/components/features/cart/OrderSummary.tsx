import { PriceTag } from '@/components/ui/PriceTag'
import { formatPrice } from '@/lib/money'
import type { Totals } from '@/types/cart'

type Props = { totals: Totals }

export function OrderSummary({ totals }: Props) {
  return (
    <dl className="flex flex-col gap-2" aria-label="Order totals">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(totals.subtotalCents)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Tip</dt>
        <dd className="tabular-nums" data-testid="tip-amount">
          {formatPrice(totals.tipCents)}
        </dd>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 text-xl font-bold">
        <dt>Total</dt>
        <dd data-testid="order-total">
          <PriceTag cents={totals.totalCents} />
        </dd>
      </div>
    </dl>
  )
}
