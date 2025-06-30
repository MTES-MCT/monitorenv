import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'

import { TWO_MINUTES } from '../../../constants'

export const useGetVigilanceAreasWithFilters = (skip = false) => {
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)
  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const { data, isError, isFetching, isLoading } = useGetVigilanceAreasQuery(undefined, {
    pollingInterval: TWO_MINUTES,
    skip
  })

  const vigilanceAreas = data ? Object.values(data?.entities) : []

  return {
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    filteredVigilanceAreaPeriod,
    isError,
    isFetching,
    isLoading,
    vigilanceAreas,
    vigilanceAreaSpecificPeriodFilter
  }
}
