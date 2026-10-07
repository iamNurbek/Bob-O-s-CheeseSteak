import Link from 'next/link'
import type { ReactNode } from 'react'

import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type Action = { href: string; label: string }

type Props = {
  title: string
  body: string
  primary: Action
  secondary?: Action
  children?: ReactNode
}

/** Shared layout for success, cancel and 404 pages. */
export function StatusPage({ title, body, primary, secondary, children }: Props) {
  return (
    <Container className="py-16">
      <Card className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
        <h1 className="text-4xl font-extrabold text-primary">{title}</h1>
        <p className="text-lg text-muted">{body}</p>
        {children}
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={primary.href} className={buttonVariants()}>
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className={buttonVariants({ variant: 'secondary' })}>
              {secondary.label}
            </Link>
          )}
        </div>
      </Card>
    </Container>
  )
}
