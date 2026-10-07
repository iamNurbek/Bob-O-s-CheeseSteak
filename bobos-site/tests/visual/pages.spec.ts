import { expect, test } from '@playwright/test'

import { gotoReady } from '@tests/support/helpers'

const PAGES = ['/', '/menu', '/about', '/cart']

// Baselines are OS-specific; update with `npm run test:visual -- --update-snapshots`.
for (const route of PAGES) {
  test(`layout holds on ${route}`, async ({ page }) => {
    await gotoReady(page, route)
    await expect(page).toHaveScreenshot({
      fullPage: true,
      animations: 'disabled',
      mask: [page.locator('iframe')],
    })
  })
}
