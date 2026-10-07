// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/contact/route'

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )

describe('POST /api/contact', () => {
  it('accepts a valid message', async () => {
    const response = await post({
      name: 'Sam',
      email: 'sam@example.com',
      message: 'Do you cater office lunches?',
    })
    expect(response.status).toBe(200)
  })

  it('returns field errors for invalid input', async () => {
    const response = await post({ name: '', email: 'bad', message: 'hi' })
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(Object.keys(data.errors).sort()).toEqual(['email', 'message', 'name'])
  })
})
