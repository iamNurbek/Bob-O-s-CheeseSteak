import { ContactForm } from '@/components/features/home/ContactForm'
import { Hero } from '@/components/features/home/Hero'
import { HoursCard } from '@/components/features/home/HoursCard'
import { LocationCard } from '@/components/features/home/LocationCard'
import { MenuItemCard } from '@/components/features/menu/MenuItemCard'
import { Section } from '@/components/layout/Section'
import { HOME_COPY } from '@/data/copy'
import { FAVORITE_ITEMS } from '@/data/menu'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section title={HOME_COPY.favoritesTitle} body={HOME_COPY.favoritesBody}>
        <ul className="grid gap-6 md:grid-cols-3">
          {FAVORITE_ITEMS.map((item) => (
            <li key={item.id}>
              <MenuItemCard item={item} />
            </li>
          ))}
        </ul>
      </Section>
      <Section title={HOME_COPY.visitTitle} isTinted>
        <div className="grid gap-6 md:grid-cols-2">
          <LocationCard />
          <HoursCard />
        </div>
      </Section>
      <Section title={HOME_COPY.contactTitle} body={HOME_COPY.contactBody}>
        <ContactForm />
      </Section>
    </>
  )
}
