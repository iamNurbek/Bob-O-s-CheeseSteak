import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'

import { CartDrawer } from '@/components/features/cart/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MAIN_CONTENT_ID, SkipLink } from '@/components/layout/SkipLink'
import { SITE } from '@/data/site'
import { CartProvider } from '@/providers/CartProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'

import '@/styles/globals.css'

const display = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['600', '800'],
})

const text = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff6e9' },
    { media: '(prefers-color-scheme: dark)', color: '#17100d' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // next-themes sets data-theme before hydration, so the attribute differs from SSR on purpose.
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <ToastProvider>
            <CartProvider>
              <SkipLink />
              <Header />
              <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
