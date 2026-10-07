'use client'

import { useEffect } from 'react'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type Props = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function ErrorPage({ error, retry }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="py-16">
      <Card className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center" role="alert">
        <h1 className="text-4xl font-extrabold text-primary">Something went wrong</h1>
        <p className="text-lg text-muted">Sorry about that. Please try again.</p>
        <Button onClick={retry}>Try again</Button>
      </Card>
    </Container>
  )
}
