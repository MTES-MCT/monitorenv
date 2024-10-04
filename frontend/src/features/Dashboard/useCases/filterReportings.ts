import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { ReportingDateRangeEnum } from 'domain/entities/dateRange'
import { StatusFilterEnum, type Reporting } from 'domain/entities/reporting'

export function filter(
  reporting: Reporting,
  filters: { dateRange: ReportingDateRangeEnum; period?: DateAsStringRange; status: StatusFilterEnum }
) {
  let shouldBeFiltered = false
  const createdAt = customDayjs(reporting.createdAt).utc()
  switch (filters.dateRange) {
    case ReportingDateRangeEnum.DAY: {
      const now = customDayjs().utc()
      const lastTwentyFourHours = now.subtract(24, 'hour')

      shouldBeFiltered = createdAt.isBetween(now, lastTwentyFourHours)
      break
    }
    case ReportingDateRangeEnum.WEEK: {
      const endOfDay = customDayjs().utc().endOf('day')
      const lastWeek = endOfDay.subtract(1, 'week')

      shouldBeFiltered = createdAt.isBetween(endOfDay, lastWeek)
      break
    }
    case ReportingDateRangeEnum.MONTH: {
      const endOfDay = customDayjs().utc().endOf('day')
      const lastThirtyDays = endOfDay.subtract(30, 'day')

      shouldBeFiltered = createdAt.isBetween(endOfDay, lastThirtyDays)
      break
    }
    case ReportingDateRangeEnum.YEAR: {
      const endOfDay = customDayjs().utc().endOf('day')
      const lastThirtyDays = endOfDay.subtract(1, 'year')

      shouldBeFiltered = createdAt.isBetween(endOfDay, lastThirtyDays)
      break
    }
    case ReportingDateRangeEnum.CUSTOM: {
      if (!filters.period) {
        shouldBeFiltered = true
        break
      }
      const [startAfter, startBefore] = filters.period

      shouldBeFiltered = createdAt.isBetween(startAfter, startBefore)
      break
    }
    default: {
      break
    }
  }

  switch (filters.status) {
    case StatusFilterEnum.ARCHIVED:
      shouldBeFiltered =
        shouldBeFiltered &&
        reporting.isArchived &&
        !!(reporting.validityTime ? createdAt.add(reporting.validityTime, 'hour').isBefore(customDayjs().utc()) : true)
      break
    case StatusFilterEnum.IN_PROGRESS:
      shouldBeFiltered =
        shouldBeFiltered &&
        !reporting.isArchived &&
        !!(reporting.validityTime
          ? createdAt.add(reporting.validityTime, 'hour').isSameOrAfter(customDayjs().utc())
          : true)
      break
    default:
      break
  }

  return shouldBeFiltered
}
