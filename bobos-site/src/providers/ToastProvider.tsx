'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { Toast } from '@/components/ui/Toast'

const TOAST_DURATION_MS = 3500

type ToastContextValue = { showToast: (message: string) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

type Props = { children: ReactNode }

export function ToastProvider({ children }: Props) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext value={{ showToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
      >
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            onDismiss={() => setToast(null)}
            className="pointer-events-auto"
          />
        )}
      </div>
    </ToastContext>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
