import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { isActivePath, NavLink } from '@/components/layout/NavLink'

const pathname = vi.hoisted(() => ({ current: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))

describe('NavLink', () => {
  it('marks the current route with aria-current, color and underline', () => {
    pathname.current = '/menu'
    render(
      <>
        <NavLink href="/" label="Home" />
        <NavLink href="/menu" label="Menu" />
      </>,
    )
    const menu = screen.getByRole('link', { name: 'Menu' })
    expect(menu).toHaveAttribute('aria-current', 'page')
    expect(menu).toHaveClass('border-primary', 'text-primary', 'border-b-[3px]')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })
})

describe('isActivePath', () => {
  it('matches home exactly and sections by prefix', () => {
    expect(isActivePath('/', '/')).toBe(true)
    expect(isActivePath('/menu', '/')).toBe(false)
    expect(isActivePath('/menu/x', '/menu')).toBe(true)
    expect(isActivePath('/menus', '/menu')).toBe(false)
  })
})
