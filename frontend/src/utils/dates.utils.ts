import { customDayjs } from '@mtes-mct/monitor-ui'

export function maxDate(dates: (string | undefined)[]): string | undefined {
  const filteredDates = dates.filter(date => date !== undefined)
  if (filteredDates.length === 0) {
    return undefined
  }

  return filteredDates.reduce(
    (max, date) => (customDayjs(date).isAfter(customDayjs(max)) ? date : max),
    filteredDates[0]
  )
}
