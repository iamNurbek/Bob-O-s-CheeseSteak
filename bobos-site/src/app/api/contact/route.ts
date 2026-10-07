import { contactSchema, toFieldErrors } from '@/lib/validation'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be JSON.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ errors: toFieldErrors(parsed.error) }, { status: 400 })
  }
  // Demo: nothing is stored or emailed (email confirmations are a v2 item).
  return Response.json({ ok: true })
}
