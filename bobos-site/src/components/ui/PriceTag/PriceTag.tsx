import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/money'

type Props = {
  cents: number
  className?: string
}

export function PriceTag({ cents, className }: Props) {
  return (
    <span className={cn('font-display font-extrabold text-primary tabular-nums', className)}>
      {formatPrice(cents)}
    </span>
  )
}
