import { useGetDashboardsQuery } from '@api/dashboardsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'
import { filterByRegulatoryThemes } from '../useCases/filters/filterByRegulatoryThemes'
import { filterBySeaFronts } from '../useCases/filters/filterBySeaFronts'
import { filterByUnits } from '../useCases/filters/filterByUnits'
import { filterByUpdatedAt } from '../useCases/filters/filterByUpdatedAt'

export const useGetFilteredDashboardsQuery = (skip = false) => {
  const { controlUnits, regulatoryThemes, seaFronts, specificPeriod, updatedAt } = useAppSelector(
    state => state.dashboardFilters.filters
  )
  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()

  const {
    data: dashboards,
    isError,
    isFetching,
    isLoading
  } = useGetDashboardsQuery(undefined, {
    pollingInterval: TWO_MINUTES,
    skip
  })

  const filteredDashboards = useMemo(
    () =>
      dashboards
        ?.filter(dashboard => filterBySeaFronts(seaFronts, dashboard))
        .filter(dashboard => filterByUnits(controlUnits, dashboard))
        .filter(dashboard =>
          filterByRegulatoryThemes(regulatoryThemes, dashboard, Object.values(regulatoryAreas?.entities ?? []))
        )
        .filter(dashboard => filterByUpdatedAt(updatedAt, dashboard.updatedAt, specificPeriod)),
    [controlUnits, dashboards, regulatoryAreas?.entities, regulatoryThemes, seaFronts, specificPeriod, updatedAt]
  )

  return { dashboards: filteredDashboards, isError, isFetching, isLoading }
}
