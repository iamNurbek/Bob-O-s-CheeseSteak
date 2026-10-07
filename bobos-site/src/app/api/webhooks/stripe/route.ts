/** Stub: logs the event type. Real signature verification comes with Stripe test mode. */
export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null)
  const type =
    typeof payload === 'object' && payload && 'type' in payload ? String(payload.type) : 'unknown'
  console.info(`[stripe webhook stub] received ${type}`)
  return Response.json({ received: true })
}
