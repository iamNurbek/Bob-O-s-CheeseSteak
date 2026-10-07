import { useId, type ReactNode } from 'react'

type ControlProps = {
  id: string
  'aria-invalid': boolean
  'aria-describedby'?: string
}

type Props = {
  label: string
  hint?: string
  error?: string
  children: (controlProps: ControlProps) => ReactNode
}

/** Label, hint and error wiring shared by Input and TextArea. */
export function Field({ label, hint, error, children }: Props) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {error && (
        <p id={errorId} className="text-sm font-semibold text-primary">
          {error}
        </p>
      )}
    </div>
  )
}
