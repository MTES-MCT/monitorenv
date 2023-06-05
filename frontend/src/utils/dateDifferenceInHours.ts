import dayjs from 'dayjs'

export function dateDifferenceInHours(startDate: string | undefined, endDate: string | undefined) {
  if (!endDate || !startDate) {
    return 0
  }

  return dayjs(endDate).diff(startDate, 'hours', false)
}
