'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

type Props = {
  href: string
  label: string
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Active tab = color + 3px underline + aria-current, so it never relies on color alone. */
export function NavLink({ href, label }: Props) {
  const pathname = usePathname()
  const isActive = isActivePath(pathname, href)

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-11 items-center border-b-[3px] px-1 font-semibold transition-colors',
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-text hover:border-border hover:text-primary',
      )}
    >
      {label}
    </Link>
  )
}
