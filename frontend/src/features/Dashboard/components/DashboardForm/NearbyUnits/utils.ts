import { customDayjs } from '@mtes-mct/monitor-ui'
import { isSameDay } from 'rsuite/esm/utils/dateUtils'

import { NearbyUnitDateRangeEnum } from './types'

import type { Dayjs } from 'dayjs'
import type { Mission } from 'domain/entities/missions'

export function getDateRange(missions: Mission[]) {
  if (missions.length === 0) {
    return undefined
  }

  const { end, start } = missions.reduce(
    (missionDateRange: { end: Dayjs | undefined; start: Dayjs | undefined }, mission) => {
      const startMission = customDayjs(mission.startDateTimeUtc)
      const endMission = customDayjs(mission.endDateTimeUtc)

      return {
        end: endMission.isAfter(missionDateRange.end) ? endMission : missionDateRange.end,
        start: startMission.isBefore(missionDateRange.start) ? startMission : missionDateRange.start
      }
    },
    {
      end: missions[0]?.endDateTimeUtc ? customDayjs(missions[0].endDateTimeUtc) : undefined,
      start: missions[0]?.startDateTimeUtc ? customDayjs(missions[0].startDateTimeUtc) : undefined
    }
  )
  const isSingleDayRange = start && end ? isSameDay(start.toDate(), end.toDate()) : false

  return { end: end?.format('DD/MM/YYYY'), isSingleDayRange, start: start?.format('DD/MM/YYYY') }
}

type GetDatesFromFiltersProps = {
  from?: string
  periodFilter?: string
  to?: string
}
export function getDatesFromFilters({ from, periodFilter, to }: GetDatesFromFiltersProps) {
  let fromDate = from ?? undefined
  let toDate = to ?? undefined
  switch (periodFilter) {
    case NearbyUnitDateRangeEnum.TODAY:
      fromDate = customDayjs().utc().startOf('day').toISOString()
      toDate = customDayjs().utc().endOf('day').toISOString()
      break

    case NearbyUnitDateRangeEnum.NEXT_OR_LAST_SEVEN_DAYS:
      fromDate = customDayjs().utc().startOf('day').subtract(7, 'day').toISOString()
      toDate = customDayjs().utc().startOf('day').add(7, 'day').toISOString()
      break

    case NearbyUnitDateRangeEnum.SEVEN_LAST_DAYS:
      fromDate = customDayjs().utc().startOf('day').subtract(7, 'day').toISOString()
      toDate = customDayjs().utc().startOf('day').toISOString()
      break

    case NearbyUnitDateRangeEnum.FOURTEEN_LAST_DAYS:
      fromDate = customDayjs().utc().startOf('day').subtract(14, 'day').toISOString()
      toDate = customDayjs().utc().startOf('day').toISOString()
      break

    case NearbyUnitDateRangeEnum.SEVEN_NEXT_DAYS:
      fromDate = customDayjs().utc().startOf('day').toISOString()
      toDate = customDayjs().utc().startOf('day').add(7, 'day').toISOString()
      break

    case NearbyUnitDateRangeEnum.CUSTOM:
    default:
      break
  }

  return { from: fromDate, to: toDate }
}
