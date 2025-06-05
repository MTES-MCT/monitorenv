import { NearbyUnitDateRangeEnum } from '@features/Dashboard/components/DashboardForm/NearbyUnits/Filters'
import { customDayjs } from '@mtes-mct/monitor-ui'

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

  return { end: end?.format('DD/MM/YYYY'), start: start?.format('DD/MM/YYYY') }
}

type GetDatesFromFiltersProps = {
  periodFilter?: string
  startedAfter?: string
  startedBefore?: string
}
export function getDatesFromFilters({ periodFilter, startedAfter, startedBefore }: GetDatesFromFiltersProps) {
  let startedAfterDate = startedAfter ?? undefined
  const startedBeforeDate = startedBefore ?? undefined
  switch (periodFilter) {
    case NearbyUnitDateRangeEnum.TODAY:
      startedAfterDate = customDayjs().utc().startOf('day').toISOString()
      break

    case NearbyUnitDateRangeEnum.SEVEN_LAST_DAYS:
      startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString()
      break

    case NearbyUnitDateRangeEnum.FOURTEEN_LAST_DAYS:
      startedAfterDate = customDayjs().utc().startOf('day').utc().subtract(14, 'day').toISOString()
      break

    case NearbyUnitDateRangeEnum.SEVEN_NEXT_DAYS:
      startedAfterDate = customDayjs().utc().startOf('day').utc().add(7, 'day').toISOString()
      break

    case NearbyUnitDateRangeEnum.CUSTOM:
    default:
      break
  }

  return { startedAfter: startedAfterDate, startedBefore: startedBeforeDate }
}
