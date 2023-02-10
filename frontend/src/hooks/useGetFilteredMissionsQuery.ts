import { useMemo } from 'react'

import { useGetMissionsQuery } from '../api/missionsAPI'
import { useAppSelector } from './useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const {
    missionAdministrationFilter,
    missionNatureFilter,
    missionStartedAfter,
    missionStartedBefore,
    missionStatusFilter,
    missionTypeFilter,
    missionUnitFilter
  } = useAppSelector(state => state.missionFilters)

  const { data, isError, isLoading } = useGetMissionsQuery(
    {
      missionNature: missionNatureFilter,
      missionStatus: missionStatusFilter,
      missionTypes: missionTypeFilter,
      startedAfterDateTime: missionStartedAfter || undefined,
      startedBeforeDateTime: missionStartedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const missions = useMemo(() => {
    if (!data) {
      return []
    }

    if (!missionAdministrationFilter && !missionUnitFilter) {
      return data
    }

    if (missionUnitFilter) {
      return data.filter(mission => mission.controlUnits.find(controlUnit => controlUnit.name === missionUnitFilter))
    }

    return data.filter(mission =>
      mission.controlUnits.find(controlUnit => controlUnit.administration === missionAdministrationFilter)
    )
  }, [data, missionAdministrationFilter, missionUnitFilter])

  return { isError, isLoading, missions }
}
