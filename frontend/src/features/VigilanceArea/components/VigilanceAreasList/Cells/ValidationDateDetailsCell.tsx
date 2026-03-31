import { customDayjs } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

export function ValidationDateDetailsCell({ date }: { date?: string }) {
  const formattedDate = useMemo(() => {
    if (!date) {
      return '-'
    }

    const targetDate = customDayjs(date)
    const hasBeenValidated = targetDate.fromNow(true)

    if (
      hasBeenValidated.includes('heure') ||
      hasBeenValidated.includes('minute') ||
      hasBeenValidated.includes('seconde')
    ) {
      return ' < 1 jour'
    }

    return hasBeenValidated
  }, [date])

  return <span>{formattedDate}</span>
}
