'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

type Props = { children: ReactNode }

/** Sets data-theme on <html> before first paint so there's no light/dark flash. */
export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
