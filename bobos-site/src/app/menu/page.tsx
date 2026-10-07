import type { Metadata } from 'next'

import { MenuBrowser } from '@/components/features/menu/MenuBrowser'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { CATEGORIES, MENU_ITEMS } from '@/data/menu'
import { SITE } from '@/data/site'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Cheesesteaks, salads, sides, kids meals and shakes.',
}

export default function MenuPage() {
  const categories = [...CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder)
  return (
    <Container className="py-12">
      <SectionHeading as="h1" title="Menu" body={SITE.priceNotice} />
      <MenuBrowser categories={categories} items={MENU_ITEMS} />
    </Container>
  )
}
