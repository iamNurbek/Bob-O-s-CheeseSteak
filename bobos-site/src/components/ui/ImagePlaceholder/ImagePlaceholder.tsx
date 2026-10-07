import { cn } from '@/lib/cn'

type Props = {
  label: string
  className?: string
}

/** Decorative stand-in for photos; swap for next/image here when real photos arrive. */
export function ImagePlaceholder({ label, className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex aspect-[4/3] w-full items-center justify-center rounded-card bg-surface-alt p-4 text-center text-sm font-semibold text-muted',
        className,
      )}
    >
      {label}
    </div>
  )
}
