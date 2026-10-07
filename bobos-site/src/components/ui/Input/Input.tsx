import type { InputHTMLAttributes } from 'react'

import { CONTROL_CLASSES } from '@/components/ui/Input/controlClasses'
import { Field } from '@/components/ui/Input/Field'
import { cn } from '@/lib/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, ...rest }: Props) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(controlProps) => (
        <input className={cn(CONTROL_CLASSES, className)} {...controlProps} {...rest} />
      )}
    </Field>
  )
}
