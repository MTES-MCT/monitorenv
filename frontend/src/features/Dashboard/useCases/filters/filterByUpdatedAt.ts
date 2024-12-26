import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'

export function filterByUpdatedAt(
  dateRange: DateRangeEnum | undefined,
  date: string | undefined,
  specificPeriod: DateAsStringRange | undefined
): boolean {
  if (!dateRange || !date) {
    return true
  }
  const now = customDayjs().utc()
  const dateAsDayJs = customDayjs(date).utc()
  switch (dateRange) {
    case DateRangeEnum.DAY: {
      return dateAsDayJs.isBetween(now, now.startOf('day'))
    }
    case DateRangeEnum.WEEK: {
      return dateAsDayJs.isBetween(now, now.startOf('day').subtract(1, 'week'))
    }
    case DateRangeEnum.MONTH: {
      return dateAsDayJs.isBetween(now, now.startOf('day').subtract(1, 'month'))
    }
    case DateRangeEnum.YEAR: {
      return dateAsDayJs.isBetween(now, now.startOf('year'))
    }
    case DateRangeEnum.CUSTOM: {
      if (!specificPeriod) {
        return true
      }

      return dateAsDayJs.isBetween(
        customDayjs(specificPeriod[0]).utc().startOf('day'),
        customDayjs(specificPeriod[1]).utc().endOf('day')
      )
    }
    default:
      return true
  }
}
