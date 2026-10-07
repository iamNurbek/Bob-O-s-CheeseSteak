import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import { gotoReady, ROUTES_TO_CHECK } from '@tests/support/helpers'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

async function expectNoViolations(page: Page) {
  // The Google Maps iframe is third-party content we can't fix.
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).exclude('iframe').analyze()
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`,
  )
  expect(summary).toEqual([])
}

// Each Playwright project runs this in light and dark, desktop and mobile.
for (const route of ROUTES_TO_CHECK) {
  test(`no WCAG 2.1 AA violations on ${route}`, async ({ page }) => {
    await gotoReady(page, route)
    await expectNoViolations(page)
  })
}

test('no violations with the cart drawer and options dialog open', async ({ page }) => {
  await gotoReady(page, '/menu')
  await page.getByRole('button', { name: 'Add The Bob-O to cart' }).click()
  await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible()
  await expectNoViolations(page)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Choose options for Build Your Own' }).click()
  await expect(page.getByRole('dialog', { name: 'Build Your Own' })).toBeVisible()
  await expectNoViolations(page)
})

test('cart page with items has no violations', async ({ page }) => {
  await gotoReady(page, '/menu')
  await page.getByRole('button', { name: 'Add The Bob-O to cart' }).click()
  await page.getByRole('link', { name: 'View full cart' }).click()
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
  await expectNoViolations(page)
})

test('skip link moves focus to main content', async ({ page, browserName }) => {
  // Safari only tabs to links with Option+Tab, so plain Tab skips them by design.
  test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default')
  await gotoReady(page, '/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
})
