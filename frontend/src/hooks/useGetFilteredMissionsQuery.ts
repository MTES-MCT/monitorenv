import { useMemo } from 'react'

import { useGetMissionsQuery } from '../api/missionsAPI'
import { useAppSelector } from './useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const { administrationFilter, sourceFilter, startedAfter, startedBefore, statusFilter, typeFilter, unitFilter } =
    useAppSelector(state => state.missionFilters)

  const { data, isError, isLoading } = useGetMissionsQuery(
    {
      missionSource: sourceFilter,
      missionStatus: statusFilter,
      missionTypes: typeFilter,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const missions = useMemo(() => {
    if (!data) {
      return []
    }

    if (!administrationFilter && !unitFilter) {
      return data
    }

    if (unitFilter) {
      return data.filter(mission => !!mission.controlUnits.find(controlUnit => controlUnit.name === unitFilter))
    }

    return data.filter(mission =>
      mission.controlUnits.find(controlUnit => controlUnit.administration === administrationFilter)
    )
  }, [data, administrationFilter, unitFilter])

  return { isError, isLoading, missions }
}
