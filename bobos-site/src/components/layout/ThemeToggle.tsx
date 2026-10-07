'use client'

import { useTheme } from 'next-themes'

import { Icon, type IconName } from '@/components/ui/Icon'
import { useMounted } from '@/hooks/useMounted'

type ThemeChoice = 'system' | 'light' | 'dark'

const NEXT_THEME: Record<ThemeChoice, ThemeChoice> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const ICONS: Record<ThemeChoice, IconName> = { system: 'system', light: 'sun', dark: 'moon' }

const LABELS: Record<ThemeChoice, string> = {
  system: 'system theme',
  light: 'light mode',
  dark: 'dark mode',
}

function toChoice(theme: string | undefined): ThemeChoice {
  return theme === 'light' || theme === 'dark' ? theme : 'system'
}

/** Cycles System → Light → Dark. The icon waits for mount to avoid a hydration mismatch. */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const isMounted = useMounted()
  const current = toChoice(theme)
  const next = NEXT_THEME[current]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={
        isMounted ? `Using ${LABELS[current]}. Switch to ${LABELS[next]}` : 'Change theme'
      }
      aria-pressed={isMounted ? resolvedTheme === 'dark' : undefined}
      title={isMounted ? `Theme: ${current}` : undefined}
      className="inline-flex size-11 items-center justify-center rounded-control text-text hover:bg-surface-alt"
    >
      {isMounted ? <Icon name={ICONS[current]} /> : <span className="size-5" />}
    </button>
  )
}
