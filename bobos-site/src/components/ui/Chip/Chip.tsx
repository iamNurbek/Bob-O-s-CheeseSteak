import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected?: boolean
}

/** Pill button. The parent decides semantics (tab, pressed toggle) via aria props. */
export function Chip({ isSelected = false, className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-5 font-semibold transition-colors',
        isSelected
          ? 'border-primary bg-primary text-on-primary'
          : 'border-border bg-surface text-text hover:border-primary',
        className,
      )}
      {...rest}
    />
  )
}
