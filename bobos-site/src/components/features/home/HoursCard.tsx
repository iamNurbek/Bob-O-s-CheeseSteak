import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { OPENING_HOURS } from '@/data/hours'
import { formatHoursRange } from '@/lib/hours'

/** Two-column hours table, sharing the card style and grid with LocationCard. */
export function HoursCard() {
  return (
    <Card as="section" aria-labelledby="hours-heading" className="flex flex-col gap-4">
      <h3 id="hours-heading" className="flex items-center gap-2 text-2xl font-extrabold">
        <Icon name="clock" className="text-primary" />
        Hours
      </h3>
      <table className="w-full">
        <caption className="sr-only">Opening hours by day</caption>
        <tbody>
          {OPENING_HOURS.map((hours) => (
            <tr key={hours.day} className="border-b border-border last:border-b-0">
              <th scope="row" className="py-3 text-left font-semibold">
                {hours.day}
              </th>
              <td className="py-3 text-right tabular-nums">{formatHoursRange(hours)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
