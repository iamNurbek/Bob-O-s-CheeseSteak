import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { FULL_ADDRESS, SITE } from '@/data/site'

export function LocationCard() {
  return (
    <Card as="section" aria-labelledby="location-heading" className="flex flex-col gap-4">
      <h3 id="location-heading" className="flex items-center gap-2 text-2xl font-extrabold">
        <Icon name="pin" className="text-primary" />
        Location
      </h3>
      <iframe
        title={`Map showing ${SITE.name} at ${FULL_ADDRESS}`}
        src={SITE.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full rounded-control border border-border"
      />
      <address className="flex flex-col gap-2 not-italic">
        <span className="font-semibold">{FULL_ADDRESS}</span>
        <a
          href={SITE.phone.href}
          className="inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4"
        >
          <Icon name="phone" />
          {SITE.phone.display}
        </a>
        <a
          href={SITE.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
        >
          Get directions<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </address>
    </Card>
  )
}
