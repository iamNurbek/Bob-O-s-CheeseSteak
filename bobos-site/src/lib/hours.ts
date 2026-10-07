import type { OpeningHours } from '@/types/site'

/** "11:00" → "11 AM", "20:30" → "8:30 PM". */
export function formatTime(time: string): string {
  const [hourText, minuteText = '00'] = time.split(':')
  const hour = Number(hourText)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return minuteText === '00' ? `${displayHour} ${suffix}` : `${displayHour}:${minuteText} ${suffix}`
}

export function formatHoursRange(hours: OpeningHours): string {
  if (!hours.open || !hours.close) return 'Closed'
  return `${formatTime(hours.open)} – ${formatTime(hours.close)}`
}

/** One-line summary for the footer: "Open daily, 11 AM – 8 PM" when every day matches. */
export function summarizeHours(week: OpeningHours[]): string {
  const ranges = new Set(week.map(formatHoursRange))
  if (ranges.size === 1 && !ranges.has('Closed')) return `Open daily, ${[...ranges][0]}`
  return 'Hours vary by day'
}
