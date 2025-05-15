import { customDayjs } from '@mtes-mct/monitor-ui'

import { DateRangeEnum } from '../domain/entities/dateRange'

export function getDatesFromFilters(
  startedAfter: string | undefined,
  startedBefore: string | undefined,
  periodFilter: string
) {
  let startedAfterDate = startedAfter ?? undefined
  const startedBeforeDate = startedBefore ?? undefined
  switch (periodFilter) {
    case DateRangeEnum.DAY:
      // to prevent refeteching every second we don't send seconds in query
      startedAfterDate = `${customDayjs().utc().subtract(24, 'hour').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      break

    case DateRangeEnum.WEEK:
      startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString()
      break

    case DateRangeEnum.MONTH:
      startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(30, 'day').toISOString()
      break

    case DateRangeEnum.YEAR:
      startedAfterDate = customDayjs().utc().startOf('year').toISOString()
      break

    case DateRangeEnum.CUSTOM:
    default:
      break
  }

  return { startedAfterDate, startedBeforeDate }
}
