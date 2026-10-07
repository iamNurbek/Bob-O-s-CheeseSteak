import Link from 'next/link'

import { CartButton } from '@/components/features/cart/CartButton'
import { Container } from '@/components/layout/Container'
import { NavLink } from '@/components/layout/NavLink'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { NAV_LINKS, ROUTES } from '@/constants/routes'
import { SITE } from '@/data/site'

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 py-2">
        <Link
          href={ROUTES.home}
          className="font-display text-3xl font-extrabold text-primary italic"
          aria-label={`${SITE.name}, home`}
        >
          {SITE.shortName}
        </Link>
        <nav aria-label="Main" className="order-last w-full sm:order-none sm:w-auto">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:ml-auto">
          <ThemeToggle />
          <CartButton />
        </div>
      </Container>
    </header>
  )
}
