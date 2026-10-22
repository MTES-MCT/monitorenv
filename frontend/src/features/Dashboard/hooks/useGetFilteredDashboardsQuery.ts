import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetDashboardsQuery } from '@api/dashboardsAPI'
import { filterByAdmins } from '@features/Dashboard/useCases/filters/filterByAdmins'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'
import { filterBySeaFronts } from '../useCases/filters/filterBySeaFronts'
import { filterByTags } from '../useCases/filters/filterByTags'
import { filterByThemes } from '../useCases/filters/filterByThemes'
import { filterByUnits } from '../useCases/filters/filterByUnits'
import { filterByUpdatedAt } from '../useCases/filters/filterByUpdatedAt'

export const useGetFilteredDashboardsQuery = (skip = false) => {
  const { administrations, controlUnits, seaFronts, specificPeriod, tags, themes, updatedAt } = useAppSelector(
    state => state.dashboardFilters.filters
  )
  const { data: allControlUnits } = useGetControlUnitsQuery()

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
        .filter(dashboard => filterByAdmins(administrations, dashboard, allControlUnits))
        .filter(dashboard => filterByTags(tags, dashboard))
        .filter(dashboard => filterByThemes(themes, dashboard))
        .filter(dashboard => filterByUpdatedAt(updatedAt, dashboard.updatedAt, specificPeriod)),
    [administrations, allControlUnits, controlUnits, dashboards, tags, themes, seaFronts, specificPeriod, updatedAt]
  )

  return { dashboards: filteredDashboards, isError, isFetching, isLoading }
}
