import { useId, type ReactNode } from 'react'

import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { cn } from '@/lib/cn'

type Props = {
  title?: string
  body?: string
  eyebrow?: string
  headingLevel?: 'h1' | 'h2'
  isTinted?: boolean
  id?: string
  className?: string
  children: ReactNode
}

/** Page section with consistent vertical rhythm and an optional labelled heading. */
export function Section({
  title,
  body,
  eyebrow,
  headingLevel,
  isTinted = false,
  id,
  className,
  children,
}: Props) {
  const headingId = useId()
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn('py-12 sm:py-16', isTinted && 'bg-surface-alt', className)}
    >
      <Container>
        {title && (
          <SectionHeading
            id={headingId}
            title={title}
            body={body}
            eyebrow={eyebrow}
            as={headingLevel}
          />
        )}
        {children}
      </Container>
    </section>
  )
}
