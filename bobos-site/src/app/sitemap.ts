import type { MetadataRoute } from 'next'

import { NAV_LINKS } from '@/constants/routes'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return NAV_LINKS.map((link) => ({ url: `${base}${link.href}` }))
}
