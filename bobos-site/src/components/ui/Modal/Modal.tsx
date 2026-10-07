'use client'

import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useDialogBehavior } from '@/hooks/useDialogBehavior'
import { cn } from '@/lib/cn'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  variant?: 'center' | 'drawer'
}

const PANEL_CLASSES = {
  center: 'relative m-4 max-h-[90dvh] w-full max-w-xl rounded-card',
  drawer: 'absolute inset-y-0 right-0 h-full w-full sm:w-[440px]',
} as const

/** Accessible dialog used for both centered modals and the right-side cart drawer. */
export function Modal({ isOpen, onClose, title, children, footer, variant = 'center' }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialogBehavior(panelRef, isOpen, onClose)

  if (!isOpen) return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        variant === 'center' && 'items-center justify-center',
      )}
    >
      <div className="absolute inset-0 bg-scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'flex flex-col overflow-hidden bg-surface text-text shadow-raised',
          PANEL_CLASSES[variant],
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <h2 id={titleId} className="text-2xl font-extrabold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 items-center justify-center rounded-control text-2xl hover:bg-surface-alt"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <footer className="border-t border-border px-6 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
