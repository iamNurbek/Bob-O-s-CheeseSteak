export const SITE = {
  name: "Bob-O's Cheesesteaks",
  shortName: "Bob-O's",
  tagline: "Get it while it's hot.",
  description:
    'Cheesesteaks, salads and shakes made to order at 252 Main Street in Ridgefield Park, NJ.',
  address: {
    street: '252 Main Street',
    city: 'Ridgefield Park',
    state: 'NJ',
    zip: '07660',
  },
  phone: {
    display: '201-870-6065',
    href: 'tel:+12018706065',
  },
  mapEmbedUrl:
    'https://www.google.com/maps?q=252+Main+Street,+Ridgefield+Park,+NJ+07660&output=embed',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=252+Main+Street,+Ridgefield+Park,+NJ+07660',
  demoNotice:
    "Concept demo: a portfolio project. Bob-O's is closed; no orders are placed and no payments are taken.",
  priceNotice: 'Sample prices from an older menu.',
} as const

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`
