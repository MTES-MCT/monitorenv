import { Dayjs } from 'dayjs'

import { customDayjs } from './customDayjs'

export function getPreviousMonthUTC(previousNumberOfMonths: number, from: Dayjs): string {
  const previousMonthDate = from.subtract(previousNumberOfMonths, 'month')

  return previousMonthDate.format('YYYY-MM-DDTHH:mm:ss[Z]')
}

export function todayUTC(): string {
  const currentDate = customDayjs().utc()

  return currentDate.format('YYYY-MM-DDTHH:mm:ss[Z]')
}
