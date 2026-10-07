import { cn } from '@/lib/cn'

type Props = {
  message: string
  onDismiss: () => void
  className?: string
}

/** A single notification; the live region that announces it lives in ToastProvider. */
export function Toast({ message, onDismiss, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-control bg-text py-2 pr-2 pl-4 font-semibold text-bg shadow-raised',
        className,
      )}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="inline-flex size-11 items-center justify-center rounded-control text-xl"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
