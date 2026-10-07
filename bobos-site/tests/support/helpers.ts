import { expect, type Page } from '@playwright/test'

export const ROUTES_TO_CHECK = ['/', '/menu', '/about', '/cart', '/order/success', '/order/cancel']

/** Waits until client components (cart, theme) have hydrated. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByRole('button', { name: /^Cart, \d+ items?$/ })).toBeVisible()
  await page.waitForLoadState('networkidle')
}
