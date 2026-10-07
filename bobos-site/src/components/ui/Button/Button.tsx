import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

/** Shared with links styled as buttons (`<Link className={buttonVariants()} />`). */
export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-control font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-strong',
        secondary: 'border-2 border-primary bg-surface text-primary hover:bg-surface-alt',
        ghost: 'text-text hover:bg-surface-alt',
      },
      size: {
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'size-11 p-0',
      },
      isFullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, isFullWidth, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, isFullWidth }), className)}
      {...rest}
    />
  )
}
