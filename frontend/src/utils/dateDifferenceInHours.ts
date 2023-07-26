import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'

export function dateDifferenceInHours(startDate: string | undefined, endDate: string | undefined) {
  if (!endDate || !startDate) {
    return 0
  }

  return Math.round(dayjs(endDate).diff(startDate, 'hour', true))
}
