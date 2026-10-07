import type { MetadataRoute } from 'next'

import { ROUTES } from '@/constants/routes'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    rules: { userAgent: '*', allow: '/', disallow: [ROUTES.cart, '/order/', '/api/'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
