'use client'

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, TextArea } from '@/components/ui/Input'
import { API_ROUTES } from '@/constants/routes'
import { contactSchema, toFieldErrors } from '@/lib/validation'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)))
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }
    setErrors({})
    setStatus('submitting')
    try {
      const response = await fetch(API_ROUTES.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!response.ok) throw new Error(`Contact failed: ${response.status}`)
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Card className="max-w-2xl">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Name" name="name" autoComplete="name" error={errors.name} />
        <Input label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
        <TextArea label="Message" name="message" error={errors.message} />
        <Button type="submit" size="lg" disabled={status === 'submitting'} className="self-start">
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </Button>
        <div aria-live="polite">
          {status === 'success' && (
            <p className="font-semibold">
              Thanks! Your message was received (demo, nothing is emailed).
            </p>
          )}
          {status === 'error' && (
            <p className="font-semibold text-primary">Something went wrong. Please try again.</p>
          )}
        </div>
      </form>
    </Card>
  )
}
