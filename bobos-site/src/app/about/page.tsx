import type { Metadata } from 'next'

import { Section } from '@/components/layout/Section'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { ABOUT_COPY } from '@/data/copy'
import { cn } from '@/lib/cn'

export const metadata: Metadata = { title: 'About', description: ABOUT_COPY.intro }

export default function AboutPage() {
  return (
    <>
      <Section
        title={ABOUT_COPY.title}
        body={ABOUT_COPY.intro}
        headingLevel="h1"
        className="pb-0 sm:pb-0"
      >
        {null}
      </Section>
      {ABOUT_COPY.sections.map((section, index) => (
        <Section key={section.title} isTinted={index % 2 === 1}>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className={cn('flex flex-col gap-4', index % 2 === 1 && 'md:order-last')}>
              <h2 className="text-4xl font-extrabold text-primary">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <ImagePlaceholder label={section.imageLabel} />
          </div>
        </Section>
      ))}
    </>
  )
}
