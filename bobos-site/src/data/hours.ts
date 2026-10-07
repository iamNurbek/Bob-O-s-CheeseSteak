import type { OpeningHours } from '@/types/site'

// The printed menu says 11AM–8PM without listing days; assumed daily until confirmed.
export const OPENING_HOURS: OpeningHours[] = [
  { day: 'Monday', open: '11:00', close: '20:00' },
  { day: 'Tuesday', open: '11:00', close: '20:00' },
  { day: 'Wednesday', open: '11:00', close: '20:00' },
  { day: 'Thursday', open: '11:00', close: '20:00' },
  { day: 'Friday', open: '11:00', close: '20:00' },
  { day: 'Saturday', open: '11:00', close: '20:00' },
  { day: 'Sunday', open: '11:00', close: '20:00' },
]
