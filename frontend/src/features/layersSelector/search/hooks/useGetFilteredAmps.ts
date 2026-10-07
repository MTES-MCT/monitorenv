import { useGetAMPsQuery } from '@api/ampsAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import { useMemo } from 'react'

export const useGetFilteredAmps = () => {
  const { areRecentsAreasChecked, globalSearchText, searchExtent, shouldFilterSearchOnMapExtent } = useAppSelector(
    state => state.layerSearch
  )

  const apiFilters = useMemo(
    () => ({
      extent:
        shouldFilterSearchOnMapExtent && searchExtent
          ? transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
          : undefined,
      onlyRecentsAreas: areRecentsAreasChecked,
      searchQuery: globalSearchText
    }),
    [areRecentsAreasChecked, globalSearchText, shouldFilterSearchOnMapExtent, searchExtent]
  )

  const hasNoFilters = useMemo(
    () => !apiFilters.searchQuery && !apiFilters.onlyRecentsAreas && !apiFilters.extent,
    [apiFilters]
  )

  const { data, isError, isFetching, isLoading } = useGetAMPsQuery(hasNoFilters ? undefined : apiFilters)

  const results = useMemo(
    () => ({
      amps: data ?? [],
      totalCount: data?.length ?? 0
    }),
    [data]
  )

  return {
    amps: results?.amps,
    isError,
    isFetching,
    isLoading,
    totalCount: results?.totalCount
  }
}
