import Link from 'next/link'

import { buttonVariants } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

type Props = { onNavigate?: () => void }

export function EmptyCart({ onNavigate }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="font-display text-2xl font-extrabold">Your cart is empty</p>
      <p className="text-muted">Hungry? The griddle&apos;s hot.</p>
      <Link href={ROUTES.menu} onClick={onNavigate} className={buttonVariants()}>
        Browse the menu
      </Link>
    </div>
  )
}
