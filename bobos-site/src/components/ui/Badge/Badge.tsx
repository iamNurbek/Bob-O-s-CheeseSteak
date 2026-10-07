import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase',
  {
    variants: {
      tone: {
        accent: 'bg-accent text-on-accent',
        primary: 'bg-primary text-on-primary',
        neutral: 'border border-border bg-surface-alt text-text',
      },
    },
    defaultVariants: { tone: 'accent' },
  },
)

type Props = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, tone, ...rest }: Props) {
  return <span className={cn(badgeVariants({ tone }), className)} {...rest} />
}
