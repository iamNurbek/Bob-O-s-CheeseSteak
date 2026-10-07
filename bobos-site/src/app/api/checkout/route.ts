import { priceCheckout } from '@/lib/checkout'
import { createCheckoutSession } from '@/lib/stripe'
import { checkoutRequestSchema } from '@/lib/validation'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be JSON.' }, { status: 400 })
  }

  const parsed = checkoutRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid cart.' },
      { status: 400 },
    )
  }

  const priced = priceCheckout(parsed.data)
  if (!priced.ok) return Response.json({ error: priced.error }, { status: 400 })

  const session = await createCheckoutSession(priced.totals)
  return Response.json({ url: session.url, totals: priced.totals })
}
