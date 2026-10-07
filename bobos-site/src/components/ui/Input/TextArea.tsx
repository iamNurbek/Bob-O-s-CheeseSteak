import type { TextareaHTMLAttributes } from 'react'

import { CONTROL_CLASSES } from '@/components/ui/Input/controlClasses'
import { Field } from '@/components/ui/Input/Field'
import { cn } from '@/lib/cn'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  error?: string
}

export function TextArea({ label, hint, error, className, rows = 4, ...rest }: Props) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(controlProps) => (
        <textarea
          rows={rows}
          className={cn(CONTROL_CLASSES, 'resize-y', className)}
          {...controlProps}
          {...rest}
        />
      )}
    </Field>
  )
}
