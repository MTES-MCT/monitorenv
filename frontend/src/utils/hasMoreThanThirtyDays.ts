import { customDayjs } from '@mtes-mct/monitor-ui'

export function hasMoreThanThirtyDays(date?: string): boolean {
  if (!date) {
    return false
  }

  return customDayjs(date).isAfter(customDayjs().subtract(30, 'day'))
}
