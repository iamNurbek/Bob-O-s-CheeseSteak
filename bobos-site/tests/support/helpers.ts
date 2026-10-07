import { expect, type Page } from '@playwright/test'

export const ROUTES_TO_CHECK = ['/', '/menu', '/about', '/cart', '/order/success', '/order/cancel']

/** Waits until client components (cart, theme) have hydrated. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByRole('button', { name: /^Cart, \d+ items?$/ })).toBeVisible()
  await page.waitForLoadState('networkidle')
}

/** Collects console errors and uncaught exceptions; assert the list is empty at the end. */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}
