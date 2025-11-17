import { customDayjs } from '@mtes-mct/monitor-ui'

import { DateRangeEnum } from '../domain/entities/dateRange'

type GetDatesFromFiltersProps = {
  periodFilter: string
  startedAfter?: string
  startedBefore?: string
  withLast24Hours?: boolean
}

export function getDatesFromFilters({
  periodFilter,
  startedAfter,
  startedBefore,
  withLast24Hours = false
}: GetDatesFromFiltersProps) {
  let startedAfterDate = startedAfter ?? undefined
  let startedBeforeDate = startedBefore ?? undefined
  switch (periodFilter) {
    case DateRangeEnum.DAY:
      if (withLast24Hours) {
        // to prevent refeteching every second we don't send seconds in querys
        startedAfterDate = `${customDayjs().utc().subtract(24, 'hour').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      } else {
        startedAfterDate = customDayjs().utc().startOf('day').toISOString()
        startedBeforeDate = customDayjs().utc().endOf('day').toISOString()
      }
      break

    case DateRangeEnum.WEEK:
      startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString()
      startedBeforeDate = customDayjs().utc().endOf('day').toISOString()
      break

    case DateRangeEnum.MONTH:
      startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(30, 'day').toISOString()
      startedBeforeDate = customDayjs().utc().endOf('day').toISOString()
      break

    case DateRangeEnum.YEAR:
      startedAfterDate = customDayjs().utc().startOf('year').toISOString()
      break

    case DateRangeEnum.UPCOMING:
      startedAfterDate = customDayjs().utc().endOf('day').toISOString()
      break

    case DateRangeEnum.CUSTOM:
    default:
      break
  }

  return { startedAfterDate, startedBeforeDate }
}
