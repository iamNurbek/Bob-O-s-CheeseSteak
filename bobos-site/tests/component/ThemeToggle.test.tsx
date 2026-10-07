import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { ThemeProvider } from '@/providers/ThemeProvider'

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    })),
  )
})

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )

describe('ThemeToggle', () => {
  it('cycles system → light → dark and sets data-theme', async () => {
    const user = userEvent.setup()
    renderToggle()
    const button = screen.getByRole('button', { name: /Switch to light mode/ })
    await user.click(button)
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByRole('button', { name: /Switch to dark mode/ }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: /Switch to system theme/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('persists the choice in localStorage', async () => {
    const user = userEvent.setup()
    renderToggle()
    await user.click(screen.getByRole('button', { name: /Switch to light mode/ }))
    expect(window.localStorage.getItem('theme')).toBe('light')
  })
})
