import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui/Button'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { ROUTES } from '@/constants/routes'
import { HOME_COPY } from '@/data/copy'
import { SITE } from '@/data/site'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-surface-alt py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <p className="text-sm font-bold tracking-widest text-accent-text uppercase">
            {HOME_COPY.heroEyebrow}
          </p>
          <h1 id="hero-title" className="text-5xl font-extrabold text-primary sm:text-7xl">
            {HOME_COPY.heroTitle}
          </h1>
          <p className="max-w-xl text-xl text-muted">{HOME_COPY.heroBody}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={ROUTES.menu} className={buttonVariants({ size: 'lg' })}>
              Order online
            </Link>
            <Link
              href={ROUTES.menu}
              className={buttonVariants({ size: 'lg', variant: 'secondary' })}
            >
              View menu
            </Link>
          </div>
        </div>
        <ImagePlaceholder
          label={`Photo: a ${SITE.shortName} cheesesteak`}
          className="bg-surface lg:col-span-6"
        />
      </Container>
    </section>
  )
}
