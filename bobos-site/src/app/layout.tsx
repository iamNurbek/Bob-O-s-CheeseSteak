import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'

import { ThemeProvider } from '@/providers/ThemeProvider'

import '@/styles/globals.css'

const display = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['600', '800'],
})

const text = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Bob-O's Cheesesteaks",
  description: 'Concept demo site for Bob-O’s Cheesesteaks in Ridgefield Park, NJ.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // next-themes sets data-theme before hydration, so the attribute differs from SSR on purpose.
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
