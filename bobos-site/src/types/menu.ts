export type CategoryId = 'cheesesteaks' | 'salads' | 'sides' | 'kids' | 'drinks'

export type Category = {
  id: CategoryId
  name: string
  sortOrder: number
  note?: string
}

export type OptionChoice = {
  id: string
  label: string
  priceDeltaCents: number
}

/**
 * A group of choices on a menu item. `minSelected`/`maxSelected` bound how many choices
 * a guest picks; choices beyond `includedCount` cost `extraChoiceCents` each.
 */
export type OptionGroup = {
  id: string
  label: string
  minSelected: number
  maxSelected: number
  choices: OptionChoice[]
  includedCount?: number
  extraChoiceCents?: number
}

export type MenuItem = {
  id: string
  categoryId: CategoryId
  name: string
  description: string
  priceCents: number
  imageSrc?: string
  isAvailable: boolean
  isFavorite?: boolean
  options?: OptionGroup[]
}

/** Selected choice ids keyed by option group id. */
export type SelectedOptions = Record<string, string[]>
