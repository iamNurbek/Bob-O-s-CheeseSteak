import type { MenuItem, OptionGroup, SelectedOptions } from '@/types/menu'

/** Items with a required choice must go through the options dialog before adding. */
export function hasRequiredOptions(item: MenuItem): boolean {
  return (item.options ?? []).some((group) => group.minSelected > 0)
}

/** Human-readable rule for a group, e.g. "Choose 1" or "Choose 3 (up to 7)". */
export function describeGroupRule(group: OptionGroup): string {
  if (group.minSelected === 0) return `Optional, up to ${group.maxSelected}`
  if (group.minSelected === group.maxSelected) return `Choose ${group.minSelected}`
  return `Choose ${group.minSelected} (up to ${group.maxSelected})`
}

/** Returns an error message per invalid group id; empty object means valid. */
export function validateSelection(
  groups: OptionGroup[] = [],
  selected: SelectedOptions = {},
): Record<string, string> {
  const errors: Record<string, string> = {}
  const knownGroupIds = new Set(groups.map((group) => group.id))

  for (const groupId of Object.keys(selected)) {
    if (!knownGroupIds.has(groupId)) errors[groupId] = 'Unknown option.'
  }

  for (const group of groups) {
    const chosen = selected[group.id] ?? []
    const validIds = new Set(group.choices.map((c) => c.id))
    if (chosen.some((id) => !validIds.has(id)) || new Set(chosen).size !== chosen.length) {
      errors[group.id] = 'Invalid choice.'
    } else if (chosen.length < group.minSelected || chosen.length > group.maxSelected) {
      errors[group.id] = `${describeGroupRule(group)}.`
    }
  }
  return errors
}

/** Short label like "Steak · American · Grilled Onions, Mushrooms, Sliced Tomatoes". */
export function summarizeSelection(
  groups: OptionGroup[] = [],
  selected: SelectedOptions = {},
): string {
  return groups
    .map((group) => {
      const chosen = selected[group.id] ?? []
      return group.choices
        .filter((c) => chosen.includes(c.id))
        .map((c) => c.label)
        .join(', ')
    })
    .filter(Boolean)
    .join(' · ')
}

/** Toggles a choice, honoring single-choice groups (radio) and the max. */
export function toggleChoice(
  group: OptionGroup,
  selected: SelectedOptions,
  choiceId: string,
): SelectedOptions {
  const current = selected[group.id] ?? []
  if (group.maxSelected === 1) return { ...selected, [group.id]: [choiceId] }
  if (current.includes(choiceId)) {
    return { ...selected, [group.id]: current.filter((id) => id !== choiceId) }
  }
  if (current.length >= group.maxSelected) return selected
  return { ...selected, [group.id]: [...current, choiceId] }
}
