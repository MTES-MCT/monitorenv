import dayjs from 'dayjs'

export function dateDifferenceInHours(startDate: string, endDate: string) {
  return dayjs(endDate).diff(startDate, 'hours', false)
}
