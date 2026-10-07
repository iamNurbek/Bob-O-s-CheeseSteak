export const ROUTES = {
  home: '/',
  menu: '/menu',
  about: '/about',
  cart: '/cart',
  orderSuccess: '/order/success',
  orderCancel: '/order/cancel',
} as const

export const API_ROUTES = {
  checkout: '/api/checkout',
  contact: '/api/contact',
} as const

export const NAV_LINKS = [
  { href: ROUTES.home, label: 'Home' },
  { href: ROUTES.menu, label: 'Menu' },
  { href: ROUTES.about, label: 'About' },
] as const
