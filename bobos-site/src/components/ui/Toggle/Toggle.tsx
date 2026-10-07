import { useId } from 'react'

import { cn } from '@/lib/cn'

export type ToggleOption<T extends string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  legend: string
  options: readonly ToggleOption<T>[]
  value: T | null
  onChange: (value: T) => void
  isLegendHidden?: boolean
  className?: string
}

/** Segmented control built on native radios, so arrow keys and screen readers just work. */
export function Toggle<T extends string>({
  legend,
  options,
  value,
  onChange,
  isLegendHidden = false,
  className,
}: Props<T>) {
  const name = useId()

  return (
    <fieldset className={className}>
      <legend className={cn('mb-2 font-semibold', isLegendHidden && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-control border-2 border-border bg-surface px-4 font-semibold text-text transition-colors has-checked:border-primary has-checked:bg-primary has-checked:text-on-primary has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
