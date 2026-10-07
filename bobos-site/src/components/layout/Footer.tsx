import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { NAV_LINKS } from '@/constants/routes'
import { OPENING_HOURS } from '@/data/hours'
import { FULL_ADDRESS, SITE } from '@/data/site'
import { summarizeHours } from '@/lib/hours'

export function Footer() {
  return (
    <footer className="mt-auto bg-primary-strong text-on-primary">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="font-display text-2xl font-extrabold italic">{SITE.name}</p>
          <p>{SITE.tagline}</p>
        </div>
        <address className="flex flex-col gap-2 not-italic">
          <p>{FULL_ADDRESS}</p>
          <a href={SITE.phone.href} className="underline underline-offset-4">
            {SITE.phone.display}
          </a>
          <p>{summarizeHours(OPENING_HOURS)}</p>
        </address>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-on-primary/20">
        <Container className="py-4 text-sm">
          <p>{SITE.demoNotice}</p>
        </Container>
      </div>
    </footer>
  )
}
