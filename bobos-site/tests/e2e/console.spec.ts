import { expect, test } from '@playwright/test'

import { gotoReady, ROUTES_TO_CHECK, trackConsoleErrors } from '@tests/support/helpers'

// Regression: the success page looped on clearCart and flooded the console.
for (const route of ROUTES_TO_CHECK) {
  test(`no console errors on ${route}`, async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await gotoReady(page, route)
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })
}

test('no console errors through a full checkout', async ({ page }) => {
  const errors = trackConsoleErrors(page)
  await gotoReady(page, '/menu')
  await page.getByRole('button', { name: 'Add The Bob-O to cart' }).click()
  await page.getByRole('link', { name: 'Checkout' }).click()
  await page.getByRole('button', { name: 'Pay with Stripe (demo)' }).click()
  await expect(page.getByRole('heading', { name: 'Order received!' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cart, 0 items' })).toBeVisible()
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test('favicon.ico is served', async ({ request }) => {
  expect((await request.get('/favicon.ico')).status()).toBe(200)
})
