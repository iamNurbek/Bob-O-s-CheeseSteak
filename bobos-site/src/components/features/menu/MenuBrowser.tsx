'use client'

import { useRef, useState, type KeyboardEvent } from 'react'

import { MenuItemCard } from '@/components/features/menu/MenuItemCard'
import { Chip } from '@/components/ui/Chip'
import type { Category, CategoryId, MenuItem } from '@/types/menu'

type Props = {
  categories: Category[]
  items: MenuItem[]
}

const NEXT_KEY_OFFSETS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }

/** One category visible at a time via sticky tabs (keeps the menu from feeling crowded). */
export function MenuBrowser({ categories, items }: Props) {
  const [activeId, setActiveId] = useState<CategoryId>(categories[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const active = categories.find((category) => category.id === activeId) ?? categories[0]
  const visibleItems = items.filter((item) => item.categoryId === active.id)

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    let nextIndex: number | null = null
    if (event.key in NEXT_KEY_OFFSETS) {
      nextIndex = (index + NEXT_KEY_OFFSETS[event.key] + categories.length) % categories.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = categories.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    setActiveId(categories[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div role="tablist" aria-label="Menu categories" className="flex gap-2 overflow-x-auto">
          {categories.map((category, index) => {
            const isSelected = category.id === active.id
            return (
              <Chip
                key={category.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={isSelected}
                aria-controls="menu-panel"
                tabIndex={isSelected ? 0 : -1}
                isSelected={isSelected}
                onClick={() => setActiveId(category.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {category.name}
              </Chip>
            )
          })}
        </div>
      </div>
      <div
        role="tabpanel"
        id="menu-panel"
        aria-labelledby={`tab-${active.id}`}
        tabIndex={0}
        className="pt-8"
      >
        <h2 className="mb-2 text-3xl font-extrabold">{active.name}</h2>
        {active.note && <p className="mb-6 font-semibold text-accent-text">{active.note}</p>}
        <ul className="mt-6 grid gap-6 lg:grid-cols-2">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <MenuItemCard item={item} layout="horizontal" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
