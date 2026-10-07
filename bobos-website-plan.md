Markdown · bobos-website-plan.md

# Bob-O's Cheesesteaks: System Design & Build Guide (v1)

A concept demo site for Bob-O's Cheesesteaks (252 Main Street, Ridgefield Park, NJ). Customer-facing only in v1; the owner admin is v2. Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Stripe (dummy)**. Photos are **placeholders for now**. This document replaces the earlier plan and ignores the old Figma layout.

---

## 1. Goals and scope

**v1 does:** welcome visitors, show the full menu, build a cart, run a dummy Stripe checkout (delivery or pickup, tip), take reservation requests, show hours and location, and switch between light and dark mode. **v1 does not:** take real payments, store real orders, or include an owner dashboard (v2).

Principles: **simple, readable, reusable, accessible**. If something is used twice, it becomes a shared component or helper.

---

## 2. Design direction (fresh, not tied to the old Figma)

- **Feel:** a warm neighborhood diner. Lots of breathing room, big friendly type, red as the hero, orange and mustard as small accents.
- **Fixing "crowded menu":** one category visible at a time through sticky category chips (Cheesesteaks, Salads, Sides, Kids, Drinks). Items are cards in a 2-column grid on desktop and 1 column on mobile, with at least 24px gaps, a short description, a price, and one clear Add button. No giant scrolling wall of items.
- **Fixing "hours looks off":** hours live in a simple two-column table inside a card, aligned to a shared grid with the location card. Same card style everywhere.
- **Layout grid:** max content width 1200px, 12 columns on desktop, 4 on mobile, spacing scale of 4/8/12/16/24/32/48/64.
- **Type:** one display font for headings (a friendly heavy sans or slab) and one text font (Inter or system). Maximum two families.
- **Header:** logo left, nav right, theme toggle and Cart button at the far right. The current page's tab is highlighted by color, a 3px underline and `aria-current="page"`, so it never relies on color alone.
- **Tagline ideas to test:** "Get it while it's hot." / "Real food. No secret ingredients." / "Ridgefield Park's best bite."

---

## 3. Color system and dark mode

Brand DNA from the logos and menu: **red + orange on cream/white**. Colors are defined **once** as semantic tokens (CSS variables); components never use raw hex values.

### Semantic tokens

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#FFF6E9` | `#17100D` | Page background |
| `--surface` | `#FFFFFF` | `#241914` | Cards, header |
| `--surface-alt` | `#FBE3E1` | `#33241D` | Tinted sections, image placeholders |
| `--text` | `#2B1A14` | `#FFF6E9` | Body text (15.6:1 light, 17.6:1 dark) |
| `--text-muted` | `#6B4F43` | `#C9B8A8` | Secondary text (8.9:1 on dark surface) |
| `--primary` | `#C8201B` | `#FF6B5E` | Buttons, active nav, links |
| `--on-primary` | `#FFFFFF` | `#17100D` | Text on primary (5.7:1 light, 6.7:1 dark) |
| `--primary-strong` | `#8E1B16` | `#FF8A7F` | Hover, footer |
| `--accent` | `#F5A524` | `#FFB547` | Badges, highlights (dark text on it, 8.2:1+) |
| `--accent-text` | `#B34700` | `#FF8A4C` | Orange used as text (5.1:1 light, 7.3:1 dark) |
| `--border` | `#E8D7C3` | `#43322A` | Dividers, outlines |
| `--focus` | `#1F5FBF` | `#7FB2FF` | Keyboard focus ring |

**Rules:** never put white text on the brand orange (3.1:1 fails). Orange text uses `--accent-text`. Dark mode lightens the red (a deep red on dark brown would be muddy), which is why the button text flips to dark.

### How the toggle works

1. Three states: **System** (default), **Light**, **Dark**. A single `ThemeToggle` button cycles or opens a small menu.
2. Use `next-themes` with `attribute="data-theme"` and `defaultTheme="system"`. It stores the choice in `localStorage` and avoids the white flash on load by setting the theme before first paint.
3. Tokens live in `styles/tokens.css` as CSS variables under `:root` (light) and `[data-theme="dark"]`, and are exposed to Tailwind through its theme (`@theme` in Tailwind v4, or `theme.extend.colors` in v3), e.g. `primary: 'var(--primary)'`. Components only use classes like `bg-surface`, so **nothing else changes** when the theme flips. Do not rely on scattered `dark:` variants for brand colors; the variables handle it in one place.
4. The toggle is a real `<button>` with `aria-label` ("Switch to dark mode"), `aria-pressed`, and a visible focus ring. Render the icon only after mount to prevent hydration mismatch.
5. Test both themes in every visual and accessibility test.

---

## 4. Pages and user flows

| Route | Contents |
| --- | --- |
| `/` | Hero + tagline, "Order online" and "View menu" buttons, 3 favorites, location card with Google Maps iframe, hours card, contact form |
| `/about` | Story sections ("Real Food." and "No Secret Ingredients."), photos |
| `/menu` | Sticky category chips, item cards, add-to-cart, Build Your Own modal |
| `/cart` (plus header **cart drawer**) | Line items, quantity controls, Delivery/Pickup toggle, tip selector, totals, Stripe button |
| `/order/success`, `/order/cancel` | Return pages from the dummy checkout |
| `/reservation` | Party size, date, time slot grid, submit |
| `not-found`, `error` | Friendly 404 and error pages |

**Main flow:** Home, Menu, add items, Cart, choose Delivery/Pickup, choose tip, "Pay with Stripe (demo)", Success.

### Cart drawer (header Cart button)

- Clicking **Cart (n)** opens a right-side drawer (440px on desktop, full width on mobile) over a dimmed scrim. It lists items with quantity steppers (−, count, +), a subtotal, **Checkout** and **View full cart** buttons. Delivery/pickup and tip stay on the full Cart page, so the drawer stays small.
- Opens automatically the first time an item is added; closes on Close, scrim click, or `Esc`.
- Built on the shared `Modal`/`Drawer` UI primitive: focus is trapped inside, focus returns to the Cart button on close, `role="dialog"`, `aria-modal`, and the page behind doesn't scroll.
- Reads from the same `CartProvider` as the Cart page. Line items use one shared `CartLine` component in both places.
- Empty state: "Your cart is empty" with a "Browse the menu" button.
- Tests: opens/closes by click and `Esc`, focus trap, quantity change updates subtotal, count badge updates, works in both themes.

### Checkout rules (dummy but correct)

- Fulfillment toggle: **Delivery / Pickup** (visual, no address validation).
- Tip: **15% / 20% / 25% / Custom**, calculated on the **subtotal** and added to the total.
- All money is stored and calculated in **integer cents**, rounded once. Example: 15% of $11.99 = 179.85 cents, rounded to 180.
- One pure function `calculateTotals()` handles subtotal, tip and total so it is easy to test.
- The Stripe button calls `POST /api/checkout`, which returns a **mock** URL (`/order/success?demo=true`). A visible "Demo only, no payment taken" note appears.
- Custom tip: choose **dollar amount** (clearer than mixing with percentages); clamp between $0 and a sensible maximum.

---

## 5. Folder structure

```
bobos-site/
├── public/
│   ├── images/                    # logo.svg only for now (photos later)
│   └── fonts/
├── src/
│   ├── app/                       # routing only: thin pages
│   │   ├── layout.tsx             # providers, header, footer, theme
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── menu/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── reservation/page.tsx
│   │   ├── order/{success,cancel}/page.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── api/
│   │       ├── checkout/route.ts          # dummy Stripe session
│   │       ├── reservations/route.ts
│   │       ├── contact/route.ts
│   │       └── webhooks/stripe/route.ts   # stub
│   ├── components/
│   │   ├── ui/                    # generic building blocks (no business logic)
│   │   │   ├── Button/ Card/ Badge/ Input/ Modal/ Chip/ Toggle/ Toast/ ImagePlaceholder/
│   │   ├── layout/                # Header, Footer, Container, Section, NavLink, ThemeToggle
│   │   └── features/              # business components, grouped by feature
│   │       ├── home/              # Hero, FavoriteCard, LocationCard, HoursCard, ContactForm
│   │       ├── menu/              # CategoryChips, MenuItemCard, BuildYourOwnModal
│   │       ├── cart/              # CartDrawer, CartLine, FulfillmentToggle, TipSelector, OrderSummary
│   │       └── reservation/       # ReservationForm, TimeSlotGrid
│   ├── data/                      # static typed content (menu, hours, copy)
│   │   ├── menu.ts
│   │   ├── hours.ts
│   │   └── site.ts                # name, address, phone, social links
│   ├── hooks/                     # useCart, useTheme, useMounted
│   ├── lib/                       # pure helpers, no React
│   │   ├── money.ts               # toCents, formatPrice, calculateTotals
│   │   ├── validation.ts          # zod schemas (shared by client and API)
│   │   ├── stripe.ts              # dummy client wrapper
│   │   └── cn.ts                  # className joiner
│   ├── providers/                 # ThemeProvider, CartProvider
│   ├── styles/
│   │   ├── tokens.css             # colors, spacing, radii, shadows, type scale
│   │   └── globals.css            # reset + base styles
│   ├── types/                     # shared TypeScript types
│   └── constants/                 # routes.ts, limits.ts (tip options, max qty)
├── tests/
│   ├── unit/                      # money, validation, cart reducer
│   ├── component/                 # NavLink active state, TipSelector, ThemeToggle
│   ├── api/                       # route handlers
│   ├── e2e/                       # Playwright: full flows, mobile + desktop, both themes
│   ├── a11y/                      # axe-core on every route, both themes
│   ├── visual/                    # screenshots, light and dark
│   └── mocks/                     # MSW handlers, fixtures
├── .github/workflows/ci.yml
├── .env.example
├── eslint.config.mjs  .prettierrc  tsconfig.json
├── vitest.config.ts   playwright.config.ts
└── README.md
```

**Why it's shaped this way:** `app/` only routes, `components/ui` knows nothing about the restaurant, `features/` holds restaurant-specific pieces, and `lib/` holds testable pure logic. Each component folder holds `Component.tsx` (Tailwind classes), `Component.test.tsx` and `index.ts`.

---

## 6. Data model (TypeScript types)

- `Category { id, name, sortOrder }`
- `MenuItem { id, categoryId, name, description, priceCents, imageSrc?, isAvailable, options? }`
- `BuildYourOwn { protein: 'steak' | 'chicken'; cheese; toppings: Topping[] (exactly 3) }`
- `CartLine { menuItemId, quantity, selectedOptions? }`
- `FulfillmentMethod = 'delivery' | 'pickup'`
- `TipSelection = { type: 'percent', value: 15 | 20 | 25 } | { type: 'custom', cents: number }`
- `Totals { subtotalCents, tipCents, totalCents }`
- `Reservation { partySize, date, time, name, email }`
- `OpeningHours { day, open, close }`

Menu data comes from the real menu sheet and is labeled as sample data. Cart state lives in `CartProvider` using `useReducer`, persisted to `localStorage` (wrapped in try/catch).

---

## 7. Component rules and reuse map

- **Build `ui/` first:** Button (variants: primary, secondary, ghost), Card, Input, Chip, Modal, Toggle. Every feature component is assembled from these.
- **One source for repeated things:** `Section` (padding and heading), `PriceTag`, `Container`, `SectionHeading`. If the same JSX appears twice, extract it.
- **Props over copies:** variants via props (`variant="primary"`), not separate components.
- **Server components by default.** Add `"use client"` only for interactive parts (cart, toggles, forms).
- **Content separate from layout:** text, prices and hours come from `data/`, never typed into JSX.

---

## 8. Testing strategy (run before anything ships)

| Layer | Tool | What it proves |
| --- | --- | --- |
| Static | ESLint, `tsc --noEmit`, Prettier check | No type, lint or format errors |
| Unit | Vitest | `calculateTotals` (each tip % across several subtotals, rounding, custom tip limits), validation, cart reducer |
| Component | React Testing Library | Active nav tab highlights on the right route; tip selector updates total; theme toggle switches and persists |
| API | Vitest + MSW | `/api/checkout` rejects bad carts, returns mock URL |
| E2E | Playwright | Browse, add to cart, tip, checkout, success; reservation; on mobile and desktop |
| Accessibility | axe-core + manual keyboard pass | WCAG 2.1 AA on every page, **in both themes** |
| Visual | Playwright screenshots | Layouts hold in light and dark |
| Performance | Lighthouse CI | Scores of 90 or higher, optimized images |

**CI gate order:** format, lint, typecheck, unit, component, API, E2E, a11y. A red step blocks merging.

---

## 9. Accessibility checklist

- Contrast verified for every token pairing in both themes (table above)
- Active tab = color + underline + `aria-current`
- Skip-to-content link, visible focus ring (`--focus`), 44px minimum touch targets
- Placeholders are `aria-hidden` / decorative; real photos get alt text later; labeled form fields with clear error messages
- Time-slot grid and tip selector usable by keyboard (radio-group semantics)
- Respect `prefers-reduced-motion` and `prefers-color-scheme`
- Map iframe has a `title` and a text address fallback

---

## 10. Code rules (apply everywhere)

**Structure and naming**

1. One component per file. File name = component name (`TipSelector.tsx`), PascalCase for components, camelCase for functions and variables, `SCREAMING_SNAKE_CASE` for constants, kebab-case for non-component folders.
2. Name things for what they are: `calculateTotals`, not `doMath`. Booleans start with `is`, `has`, `should`.
3. Keep files short: aim for under 150 lines per component and under 40 lines per function. If it grows, split it.
4. Prefer early returns over deep nesting.

**TypeScript** 5. `strict: true`. **No `any`.** Use `unknown` and narrow, or write a real type. 6. Type props with an explicit `Props` type; export shared types from `types/`. 7. Use union types instead of loose strings (`'delivery' | 'pickup'`). 8. Validate all external input (forms, API bodies) with **zod**, one schema shared by client and server.

**Reusability** 9. **DRY with judgment:** extract on the second use, not the tenth. Shared logic goes in `lib/` or `hooks/`. 10. UI components never import feature code. Features import UI. Never the reverse. 11. No magic values: colors come from tokens, routes from `constants/routes.ts`, tip options and limits from `constants/limits.ts`. 12. Money logic exists in **one** place (`lib/money.ts`). Nobody else does currency math.

**Readability** 13. Prettier decides formatting (never argue style in review). ESLint catches the rest. Both run on save and in CI. 14. Comments explain **why**, not what. Public helpers get a one-line doc comment. 15. No commented-out code, no stray `console.log`, no unused imports (lint enforces this). 16. Keep imports ordered: external, then `@/` aliases, then relative, then styles. Use the `@/` alias, no `../../../`.

**Styling** 17. **Tailwind only**: no raw hex, no inline styles, no separate CSS files except `globals.css`. Colors come from semantic tokens mapped in Tailwind (`bg-surface`, `text-muted`, `bg-primary`), never from default palette colors like `bg-red-600`. Repeated class strings become a component or a `cva` variant, not copy-paste. 18. Mobile first. Layouts use CSS grid or flex with the shared spacing scale.

**Quality** 19. Every function in `lib/` has unit tests; every bug fix adds a test that would have caught it. 20. Handle loading, empty and error states for every screen, not just the happy path. 21. Never commit secrets. Keys live in `.env.local`; `.env.example` lists names only. 22. Commits follow Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`). Small pull requests, one purpose each. Use Husky + lint-staged to format and lint before every commit.

---

## 11. Stripe (dummy)

- `POST /api/checkout`: validates the cart, recomputes totals **on the server**, returns `{ url: "/order/success?demo=true" }`.
- Optional upgrade: Stripe **test mode** (card 4242 4242 4242 4242) for a real hosted page, still no real money.
- `POST /api/webhooks/stripe`: stub that logs events.
- Keys in `.env.local` only.

---

## 12. Build phases

1. **Foundation:** repo, TypeScript strict, ESLint/Prettier/Husky, CI, test harness, `tokens.css`, ThemeProvider
2. **UI kit:** Button, Card, Input, Chip, Modal, Toggle (+ tests, both themes)
3. **Layout:** Header (active tab + theme toggle + cart), Footer, Container, Section
4. **Static pages:** Home, About, Menu (real data)
5. **Interactive:** CartProvider, add to cart, Build Your Own, TipSelector, totals
6. **Checkout and reservation:** dummy Stripe route, success/cancel, reservation form
7. **QA:** accessibility, performance, cross-device, bug bash
8. **Polish:** SEO metadata, Open Graph, favicon, demo notice, README with screenshots
9. **v2:** admin dashboard, real database (Postgres + Prisma behind the same types), email confirmations

---

## 13. Risks and notes

- The business is closed and the logo and photos belong to it: keep a visible "concept demo" notice, and treat this as a portfolio project.
- Menu prices come from an older sheet; label them as sample data.
- Reservation page is unusual for a cheesesteak counter; consider reframing as **catering / large-order requests**.
- **Photos are placeholders in v1.** A single `ImagePlaceholder` component (fixed aspect ratio via `aspect-[4/3]`, `bg-surface-alt`, a label) is used everywhere, so layouts don't shift. When real photos arrive, swap it for `next/image` in one place.