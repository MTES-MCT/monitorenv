import { useMemo } from 'react'

import { useGetMissionsQuery } from '../api/missionsAPI'
import { administrationFilterFunction } from '../domain/use_cases/missions/filters/administrationFilterFunction'
import { themeFilterFunction } from '../domain/use_cases/missions/filters/themeFilterFunction'
import { unitFilterFunction } from '../domain/use_cases/missions/filters/unitFilterFunction'
import { useAppSelector } from './useAppSelector'

const TWO_MINUTES = 2 * 60 * 1000

export const useGetFilteredMissionsQuery = () => {
  const {
    administrationFilter,
    seaFrontFilter,
    sourceFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    themeFilter,
    typeFilter,
    unitFilter
  } = useAppSelector(state => state.missionFilters)
  const { data, isError, isFetching, isLoading } = useGetMissionsQuery(
    {
      missionSource: sourceFilter,
      missionStatus: statusFilter,
      missionTypes: typeFilter,
      seaFronts: seaFrontFilter,
      startedAfterDateTime: startedAfter || undefined,
      startedBeforeDateTime: startedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const missions = useMemo(() => {
    if (!data) {
      return []
    }

    if (administrationFilter.length === 0 && unitFilter.length === 0 && themeFilter.length === 0) {
      return data
    }

    return data.filter(
      mission =>
        administrationFilterFunction(mission, administrationFilter) &&
        unitFilterFunction(mission, unitFilter) &&
        themeFilterFunction(mission, themeFilter)
    )
  }, [data, administrationFilter, themeFilter, unitFilter])

  return { isError, isFetching, isLoading, missions }
}
