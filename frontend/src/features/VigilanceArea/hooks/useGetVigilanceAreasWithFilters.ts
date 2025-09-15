import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'

export const useGetVigilanceAreasWithFilters = (skip = false) => {
  const { period, specificPeriod } = useAppSelector(state => state.vigilanceAreaFilters)
  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const { data, isError, isFetching, isLoading } = useGetVigilanceAreasQuery(undefined, {
    pollingInterval: TWO_MINUTES,
    skip
  })

  const vigilanceAreas = useMemo(() => (data ? Object.values(data?.entities) : []), [data])

  return {
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    filteredVigilanceAreaPeriod: period,
    isError,
    isFetching,
    isLoading,
    vigilanceAreas,
    vigilanceAreaSpecificPeriodFilter: specificPeriod
  }
}
