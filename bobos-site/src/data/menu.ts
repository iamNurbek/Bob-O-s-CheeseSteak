import type { Category, MenuItem, OptionGroup } from '@/types/menu'

// Transcribed from the printed menu (Menu & Prices.png). Prices are sample data.

export const CATEGORIES: Category[] = [
  { id: 'cheesesteaks', name: 'Cheesesteaks', sortOrder: 1 },
  { id: 'salads', name: 'Salads', sortOrder: 2, note: 'Ask about our seasonal salad!' },
  { id: 'sides', name: 'Sides', sortOrder: 3 },
  {
    id: 'kids',
    name: 'Kids',
    sortOrder: 4,
    note: 'All kids options come with a portion of fries.',
  },
  { id: 'drinks', name: 'Drinks', sortOrder: 5 },
]

const choice = (id: string, label: string, priceDeltaCents = 0) => ({ id, label, priceDeltaCents })

const CHEESESTEAK_EXTRAS: OptionGroup = {
  id: 'extras',
  label: 'Extras',
  minSelected: 0,
  maxSelected: 2,
  choices: [choice('extra-meat', 'Extra meat', 399), choice('extra-cheese', 'Extra cheese', 99)],
}

const BYO_OPTIONS: OptionGroup[] = [
  {
    id: 'protein',
    label: 'Steak or chicken',
    minSelected: 1,
    maxSelected: 1,
    choices: [choice('steak', 'Steak'), choice('chicken', 'Chicken')],
  },
  {
    id: 'cheese',
    label: 'Choose your cheese',
    minSelected: 1,
    maxSelected: 1,
    choices: [
      choice('american', 'American'),
      choice('provolone', 'Provolone'),
      choice('swiss', 'Swiss'),
      choice('mozzarella', 'Mozzarella'),
      choice('pepper-jack', 'Pepper Jack'),
      choice('cheese-whiz', 'Melted Cheese Whiz'),
    ],
  },
  {
    id: 'toppings',
    label: 'Choose three toppings',
    minSelected: 3,
    maxSelected: 7,
    includedCount: 3,
    extraChoiceCents: 49,
    choices: [
      choice('roasted-peppers', 'Roasted Sweet Peppers'),
      choice('grilled-onions', 'Grilled Onions'),
      choice('cherry-peppers', 'Hot Cherry Peppers'),
      choice('mushrooms', 'Mushrooms'),
      choice('raw-onion', 'Shaved Raw Onion'),
      choice('lettuce', 'Shredded Lettuce'),
      choice('tomatoes', 'Sliced Tomatoes'),
    ],
  },
  CHEESESTEAK_EXTRAS,
]

const SALAD_PROTEIN: OptionGroup = {
  id: 'add-protein',
  label: 'Add steak or chicken',
  minSelected: 0,
  maxSelected: 1,
  choices: [choice('steak', 'Add steak', 599), choice('chicken', 'Add chicken', 599)],
}

type ItemSeed = Omit<MenuItem, 'isAvailable' | 'categoryId'>

const inCategory = (categoryId: MenuItem['categoryId'], seeds: ItemSeed[]): MenuItem[] =>
  seeds.map((seed) => ({ ...seed, categoryId, isAvailable: true }))

export const MENU_ITEMS: MenuItem[] = [
  ...inCategory('cheesesteaks', [
    {
      id: 'the-bob-o',
      name: 'The Bob-O',
      description: 'Shaved ribeye steak, grilled onions, green peppers, American cheese.',
      priceCents: 1199,
      isFavorite: true,
      options: [CHEESESTEAK_EXTRAS],
    },
    {
      id: 'the-hot-daddy',
      name: 'The Hot Daddy',
      description:
        'Thinly sliced chicken, hot cherry peppers, shaved raw onions, spicy pepper jack cheese.',
      priceCents: 1199,
      isFavorite: true,
      options: [CHEESESTEAK_EXTRAS],
    },
    {
      id: 'the-scarlet',
      name: 'The Scarlet',
      description:
        'Shaved ribeye, marinara sauce, roasted sweet peppers, grilled onions, mozzarella cheese.',
      priceCents: 1199,
      options: [CHEESESTEAK_EXTRAS],
    },
    {
      id: 'the-cali',
      name: 'The Cali',
      description:
        'Thinly sliced chicken, shredded lettuce, tomato, mayo, shaved raw onions, American cheese.',
      priceCents: 1199,
      options: [CHEESESTEAK_EXTRAS],
    },
    {
      id: 'the-veggie',
      name: 'The Veggie',
      description: 'Eggplant, roasted sweet peppers, grilled onions, mushrooms, provolone cheese.',
      priceCents: 1099,
      options: [CHEESESTEAK_EXTRAS],
    },
    {
      id: 'the-ron-man',
      name: 'The Ron Man',
      description:
        'Shaved ribeye, chicken fingers, mozzarella sticks, honey mustard, American cheese.',
      priceCents: 1399,
      isFavorite: true,
      options: [CHEESESTEAK_EXTRAS],
    },
    {
      id: 'build-your-own',
      name: 'Build Your Own',
      description:
        'Steak or chicken, your choice of cheese and three toppings. Extra toppings $0.49 each.',
      priceCents: 1199,
      options: BYO_OPTIONS,
    },
  ]),
  ...inCategory('salads', [
    {
      id: 'mixed-greens-salad',
      name: 'Mixed Greens Bob-O Salad',
      description:
        'Romaine lettuce, baby arugula and iceberg, shaved red onions, toasted croutons, garlic dressing.',
      priceCents: 699,
      options: [SALAD_PROTEIN],
    },
    {
      id: 'iceberg-salad',
      name: 'Iceberg Salad',
      description: 'Chunks of iceberg lettuce, plum tomatoes, cucumber, ranch dressing.',
      priceCents: 699,
      options: [SALAD_PROTEIN],
    },
  ]),
  ...inCategory('sides', [
    {
      id: 'french-fries',
      name: 'French Fries',
      description: 'Hot, crispy, salted.',
      priceCents: 399,
    },
    {
      id: 'cheese-whiz-fries',
      name: 'Melted Cheese Whiz Fries',
      description: 'Fries smothered in melted Cheese Whiz.',
      priceCents: 499,
    },
    { id: 'onion-rings', name: 'Onion Rings', description: 'Golden and crunchy.', priceCents: 399 },
    {
      id: 'mozzarella-sticks',
      name: 'Mozzarella Sticks',
      description: 'Breaded, fried and stretchy.',
      priceCents: 499,
    },
  ]),
  ...inCategory('kids', [
    {
      id: 'kids-chicken-fingers',
      name: 'Chicken Fingers',
      description: 'Crispy chicken fingers with a portion of fries.',
      priceCents: 999,
    },
    {
      id: 'kids-grilled-cheese',
      name: 'Grilled Cheese',
      description: 'Melty grilled cheese with a portion of fries.',
      priceCents: 699,
    },
  ]),
  ...inCategory('drinks', [
    {
      id: 'shake',
      name: 'Shake',
      description: 'Thick and creamy. Strawberry, vanilla or chocolate.',
      priceCents: 699,
      options: [
        {
          id: 'flavor',
          label: 'Flavor',
          minSelected: 1,
          maxSelected: 1,
          choices: [
            choice('strawberry', 'Strawberry'),
            choice('vanilla', 'Vanilla'),
            choice('chocolate', 'Chocolate'),
          ],
        },
      ],
    },
    {
      id: 'fresh-lemonade',
      name: 'Fresh Lemonade',
      description: 'Fresh, cold and tart.',
      priceCents: 499,
    },
    {
      id: 'water-soda',
      name: 'Water / Soda',
      description: 'Bottled water or a can of soda.',
      priceCents: 150,
      options: [
        {
          id: 'drink',
          label: 'Choose a drink',
          minSelected: 1,
          maxSelected: 1,
          choices: [choice('water', 'Water'), choice('soda', 'Soda')],
        },
      ],
    },
  ]),
]

export const FAVORITE_ITEMS = MENU_ITEMS.filter((item) => item.isFavorite)

export function findMenuItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === id)
}
