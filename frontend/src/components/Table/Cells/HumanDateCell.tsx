import { customDayjs } from '@mtes-mct/monitor-ui'

export function HumanDateCell({ date }: { date: string | undefined }) {
  if (!date) {
    return <span>-</span>
  }
  const formattedDate = customDayjs(date).format('DD MMM YY, HH[h]mm')

  return <span title={formattedDate}>{formattedDate}</span>
}
