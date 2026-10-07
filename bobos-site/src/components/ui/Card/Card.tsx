import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li'
}

export function Card({ as: Tag = 'div', className, ...rest }: Props) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-border bg-surface p-6 text-text shadow-card',
        className,
      )}
      {...rest}
    />
  )
}
