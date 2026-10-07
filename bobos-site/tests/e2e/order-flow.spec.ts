import { expect, test } from '@playwright/test'

import { gotoReady } from '@tests/support/helpers'

test('browse, add to cart, tip, checkout and see success', async ({ page }) => {
  await gotoReady(page, '/')
  await page.getByRole('link', { name: 'Order online' }).click()
  await expect(page).toHaveURL(/\/menu$/)
  await expect(page.getByRole('link', { name: 'Menu', exact: true }).first()).toHaveAttribute(
    'aria-current',
    'page',
  )

  // First add opens the drawer.
  await page.getByRole('button', { name: 'Add The Bob-O to cart' }).click()
  const drawer = page.getByRole('dialog', { name: 'Your cart' })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByText('The Bob-O')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()

  // Build Your Own via the options dialog.
  await page.getByRole('button', { name: 'Choose options for Build Your Own' }).click()
  const byo = page.getByRole('dialog', { name: 'Build Your Own' })
  await byo.getByText('Steak', { exact: true }).click()
  await byo.getByText('American', { exact: true }).click()
  for (const topping of ['Grilled Onions', 'Mushrooms', 'Roasted Sweet Peppers']) {
    await byo.getByText(topping, { exact: true }).click()
  }
  await byo.getByRole('button', { name: 'Add to cart · $11.99' }).click()
  await expect(page.getByRole('status')).toContainText('Added Build Your Own')
  await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible()

  // Drinks tab: shakes need a flavor.
  await page.getByRole('tab', { name: 'Drinks' }).click()
  await page.getByRole('button', { name: 'Choose options for Shake' }).click()
  const shake = page.getByRole('dialog', { name: 'Shake' })
  await shake.getByText('Chocolate', { exact: true }).click()
  await shake.getByRole('button', { name: /Add to cart/ }).click()

  // Full cart: pickup + 20% tip. Subtotal 11.99 + 11.99 + 6.99 = 30.97; 20% = 6.19.
  await page.getByRole('button', { name: 'Cart, 3 items' }).click()
  await page.getByRole('link', { name: 'View full cart' }).click()
  await expect(page).toHaveURL(/\/cart$/)
  await page.getByText('Pickup', { exact: true }).click()
  await page.getByText(/^20%/).click()
  await expect(page.getByTestId('tip-amount')).toHaveText('$6.19')
  await expect(page.getByTestId('order-total')).toHaveText('$37.16')
  await expect(page.getByText('Demo only, no payment taken.')).toBeVisible()

  await page.getByRole('button', { name: 'Pay with Stripe (demo)' }).click()
  await expect(page).toHaveURL(/\/order\/success\?demo=true$/)
  await expect(page.getByRole('heading', { name: 'Order received!' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cart, 0 items' })).toBeVisible()
})

test('cart survives a reload and quantity controls update totals', async ({ page }) => {
  await gotoReady(page, '/menu')
  await page.getByRole('tab', { name: 'Sides' }).click()
  await page.getByRole('button', { name: 'Add French Fries to cart' }).click()
  const drawer = page.getByRole('dialog', { name: 'Your cart' })
  await drawer.getByRole('button', { name: 'Increase French Fries' }).click()
  await expect(drawer.getByText('Subtotal').locator('..')).toContainText('$7.98')

  await page.reload()
  await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible()
  await page.getByRole('button', { name: 'Cart, 2 items' }).click()
  await page.getByRole('button', { name: 'Decrease French Fries' }).click()
  await page.getByRole('button', { name: 'Remove French Fries' }).click()
  await expect(page.getByText('Your cart is empty')).toBeVisible()
})

test('custom tip is clamped and keyboard can reach checkout', async ({ page }) => {
  await gotoReady(page, '/menu')
  await page.getByRole('button', { name: 'Add The Ron Man to cart' }).click()
  await page.getByRole('link', { name: 'Checkout' }).click()
  await page.getByText('Custom', { exact: true }).click()
  await page.getByLabel('Custom tip (dollars)').fill('250')
  await expect(page.getByTestId('tip-amount')).toHaveText('$100.00')
  await expect(page.getByText('Tips are capped at $100.00.')).toBeVisible()
  await page.getByLabel('Custom tip (dollars)').fill('2')
  await expect(page.getByTestId('order-total')).toHaveText('$15.99')
})

test('menu category tabs work with the keyboard', async ({ page }) => {
  await gotoReady(page, '/menu')
  await page.getByRole('tab', { name: 'Cheesesteaks' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Salads' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { name: 'Salads', level: 2 })).toBeVisible()
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: 'Drinks' })).toBeFocused()
})

test('contact form validates and submits', async ({ page }) => {
  await gotoReady(page, '/')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('Please enter your name.')).toBeVisible()
  await page.getByLabel('Name').fill('Sam')
  await page.getByLabel('Email').fill('sam@example.com')
  await page.getByLabel('Message').fill('Do you cater office lunches?')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText(/Thanks! Your message was received/)).toBeVisible()
})

test('theme toggle switches and persists across reloads', async ({ page }) => {
  await gotoReady(page, '/')
  const html = page.locator('html')
  await page.getByRole('button', { name: /Switch to light mode/ }).click()
  await page.getByRole('button', { name: /Switch to dark mode/ }).click()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'dark')
})

test('unknown routes show the friendly 404', async ({ page }) => {
  const response = await page.goto('/does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: /fell off the griddle/ })).toBeVisible()
})
