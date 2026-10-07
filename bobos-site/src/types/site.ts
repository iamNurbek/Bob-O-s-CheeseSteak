export type DayOfWeek =
  'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

/** Times are 24h "HH:MM" strings; `null` means closed that day. */
export type OpeningHours = {
  day: DayOfWeek
  open: string | null
  close: string | null
}
