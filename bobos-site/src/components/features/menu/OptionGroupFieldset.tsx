import { describeGroupRule } from '@/lib/menu-options'
import { formatPrice } from '@/lib/money'
import type { OptionGroup } from '@/types/menu'

type Props = {
  group: OptionGroup
  selectedIds: string[]
  error?: string
  onToggle: (choiceId: string) => void
}

function priceHint(priceDeltaCents: number): string | null {
  if (priceDeltaCents > 0) return `+${formatPrice(priceDeltaCents)}`
  return null
}

/** Radios for single-choice groups, checkboxes otherwise; full options disable at the max. */
export function OptionGroupFieldset({ group, selectedIds, error, onToggle }: Props) {
  const isSingle = group.maxSelected === 1
  const isFull = selectedIds.length >= group.maxSelected
  const errorId = `${group.id}-error`
  const extraNote =
    group.extraChoiceCents && group.includedCount
      ? ` ${group.includedCount} included, then +${formatPrice(group.extraChoiceCents)} each.`
      : ''

  return (
    <fieldset
      className="flex flex-col gap-3 border-b border-border pb-6 last:border-b-0"
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-1 w-full">
        <span className="block text-lg font-bold">{group.label}</span>
        <span className="block text-sm text-muted">
          {describeGroupRule(group)}.{extraNote}
        </span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {group.choices.map((choice) => {
          const isChecked = selectedIds.includes(choice.id)
          const hint = priceHint(choice.priceDeltaCents)
          return (
            <label
              key={choice.id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control border-2 border-border px-3 py-2 has-checked:border-primary has-checked:bg-surface-alt has-disabled:cursor-not-allowed has-disabled:opacity-50"
            >
              <input
                type={isSingle ? 'radio' : 'checkbox'}
                name={group.id}
                checked={isChecked}
                disabled={!isSingle && !isChecked && isFull}
                onChange={() => onToggle(choice.id)}
                className="size-5 accent-primary"
              />
              <span className="flex-1">{choice.label}</span>
              {hint && <span className="text-sm text-muted">{hint}</span>}
            </label>
          )
        })}
      </div>
      {error && (
        <p id={errorId} className="text-sm font-semibold text-primary">
          {error}
        </p>
      )}
    </fieldset>
  )
}
