// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/checkout/route'

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

const base = { fulfillment: 'delivery', tip: { type: 'percent', value: 15 } }

describe('POST /api/checkout', () => {
  it('returns the mock success URL and server-computed totals', async () => {
    const response = await post({ ...base, lines: [{ menuItemId: 'the-bob-o', quantity: 1 }] })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      url: '/order/success?demo=true',
      totals: { subtotalCents: 1199, tipCents: 180, totalCents: 1379 },
    })
  })

  it('ignores client-supplied prices', async () => {
    const response = await post({
      ...base,
      lines: [{ menuItemId: 'the-ron-man', quantity: 2, priceCents: 1 }],
    })
    const data = await response.json()
    expect(data.totals.subtotalCents).toBe(2798)
  })

  it('prices BYO options on the server', async () => {
    const response = await post({
      ...base,
      tip: { type: 'custom', cents: 200 },
      lines: [
        {
          menuItemId: 'build-your-own',
          quantity: 1,
          selectedOptions: {
            protein: ['steak'],
            cheese: ['swiss'],
            toppings: ['mushrooms', 'lettuce', 'tomatoes'],
            extras: ['extra-meat'],
          },
        },
      ],
    })
    expect((await response.json()).totals).toEqual({
      subtotalCents: 1598,
      tipCents: 200,
      totalCents: 1798,
    })
  })

  it.each([
    ['an empty cart', { ...base, lines: [] }],
    ['an unknown item', { ...base, lines: [{ menuItemId: 'lobster', quantity: 1 }] }],
    ['missing BYO choices', { ...base, lines: [{ menuItemId: 'build-your-own', quantity: 1 }] }],
    [
      'a bad option',
      {
        ...base,
        lines: [{ menuItemId: 'shake', quantity: 1, selectedOptions: { flavor: ['mint'] } }],
      },
    ],
    ['a negative quantity', { ...base, lines: [{ menuItemId: 'the-bob-o', quantity: -1 }] }],
    ['invalid JSON', '{nope'],
  ])('rejects %s with 400', async (_label, body) => {
    const response = await post(body)
    expect(response.status).toBe(400)
    expect(await response.json()).toHaveProperty('error')
  })
})
