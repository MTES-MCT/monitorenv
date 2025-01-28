import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { getReportingStatus, ReportingStatusEnum, StatusFilterEnum, type Reporting } from 'domain/entities/reporting'

export function filterReportings(
  reporting: Reporting,
  filters: {
    dateRange: DateRangeEnum
    period?: DateAsStringRange
    status: StatusFilterEnum[]
    type: string | undefined
  }
) {
  let shouldBeFiltered = false
  const createdAt = customDayjs(reporting.createdAt).utc()
  switch (filters.dateRange) {
    case DateRangeEnum.DAY: {
      const now = customDayjs().utc()
      const lastTwentyFourHours = now.subtract(24, 'hour')

      shouldBeFiltered = createdAt.isBetween(now, lastTwentyFourHours)
      break
    }
    case DateRangeEnum.WEEK: {
      const endOfDay = customDayjs().utc().endOf('day')
      const lastWeek = endOfDay.subtract(1, 'week')

      shouldBeFiltered = createdAt.isBetween(endOfDay, lastWeek)
      break
    }
    case DateRangeEnum.MONTH: {
      const endOfDay = customDayjs().utc().endOf('day')
      const lastThirtyDays = endOfDay.subtract(30, 'day')

      shouldBeFiltered = createdAt.isBetween(endOfDay, lastThirtyDays)
      break
    }
    case DateRangeEnum.YEAR: {
      const endOfDay = customDayjs().utc().endOf('day')
      const lastThirtyDays = customDayjs().utc().startOf('year').toISOString()

      shouldBeFiltered = createdAt.isBetween(endOfDay, lastThirtyDays)
      break
    }
    case DateRangeEnum.CUSTOM: {
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

  if (filters.type) {
    shouldBeFiltered = shouldBeFiltered && reporting.reportType === filters.type
  }

  // No filter if both checkbox are checked
  if (filters.status.length !== 1) {
    return shouldBeFiltered
  }

  switch (filters.status[0]) {
    case StatusFilterEnum.ARCHIVED:
      shouldBeFiltered = shouldBeFiltered && getReportingStatus({ ...reporting }) === ReportingStatusEnum.ARCHIVED
      break
    case StatusFilterEnum.IN_PROGRESS:
      shouldBeFiltered = shouldBeFiltered && getReportingStatus({ ...reporting }) !== ReportingStatusEnum.ARCHIVED
      break
    default:
      break
  }

  return shouldBeFiltered
}
