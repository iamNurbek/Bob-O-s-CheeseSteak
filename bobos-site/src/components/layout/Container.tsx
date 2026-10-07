import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Props = HTMLAttributes<HTMLDivElement>

/** Centers content at the 1200px max width with the shared side gutters. */
export function Container({ className, ...rest }: Props) {
  return <div className={cn('mx-auto w-full max-w-content px-4 sm:px-6', className)} {...rest} />
}
