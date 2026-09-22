import { customDayjs } from '@mtes-mct/monitor-ui'

export function maxDate(dates: (string | undefined)[]): string | undefined {
  const filteredDates = dates.filter(date => date !== undefined)
  if (filteredDates.length === 0) {
    return undefined
  }

  return filteredDates.reduce((max, date) => (customDayjs(date).isAfter(customDayjs(max)) ? date : max))
}

export function compareDates(a: string | undefined, b: string | undefined, direction: 'ASC' | 'DESC' = 'ASC'): number {
  if (!a && !b) {
    return 0
  }
  if (!a) {
    return 1
  }
  if (!b) {
    return -1
  }

  return direction === 'ASC'
    ? customDayjs(a).valueOf() - customDayjs(b).valueOf()
    : customDayjs(b).valueOf() - customDayjs(a).valueOf()
}
