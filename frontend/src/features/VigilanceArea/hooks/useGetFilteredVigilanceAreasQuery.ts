import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { useAppSelector } from '@hooks/useAppSelector'
import { CustomSearch } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'
import { isVigilanceAreaPartOfCreatedBy } from '../useCases/filters/isVigilanceAreaPartOfCreatedBy'
import { isVigilanceAreaPartOfSeaFront } from '../useCases/filters/isVigilanceAreaPartOfSeaFront'
import { isVigilanceAreaPartOfStatus } from '../useCases/filters/isVigilanceAreaPartOfStatus'
import { isVigilanceAreaPartOfTheme } from '../useCases/filters/isVigilanceAreaPartOfTheme'

import type { VigilanceArea } from '../types'

export const useGetFilteredVigilanceAreasQuery = () => {
  const { createdBy, seaFronts, searchQuery, status } = useAppSelector(state => state.vigilanceAreaFilters)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const { data, isError, isFetching, isLoading } = useGetVigilanceAreasQuery(undefined, {
    pollingInterval: TWO_MINUTES
  })

  const filteredVigilanceAreas = useMemo(() => {
    if (!data?.entities) {
      return { entities: {}, ids: [] }
    }

    const vigilanceAreas = Object.values(data.entities)

    const tempVigilanceAreas = vigilanceAreas.filter(
      vigilanceArea =>
        isVigilanceAreaPartOfCreatedBy(vigilanceArea, createdBy) &&
        isVigilanceAreaPartOfSeaFront(vigilanceArea, seaFronts) &&
        isVigilanceAreaPartOfStatus(vigilanceArea, status) &&
        isVigilanceAreaPartOfTheme(vigilanceArea, filteredRegulatoryThemes)
    )

    const vigilanceAreasByPeriod = getFilterVigilanceAreasPerPeriod(
      tempVigilanceAreas,
      filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    )

    const customSearch = new CustomSearch(
      vigilanceAreasByPeriod,
      [
        { name: 'comments', weight: 0.1 },
        { name: 'name', weight: 0.9 }
      ],
      {
        cacheKey: 'VIGILANCE_AREAS_LIST_SEARCH',
        isStrict: true,
        withCacheInvalidation: true
      }
    )

    let vigilanceAreasBySearchQuery = vigilanceAreasByPeriod
    if (searchQuery && searchQuery.trim().length > 0) {
      vigilanceAreasBySearchQuery = customSearch.find(searchQuery)
    }

    return {
      entities: vigilanceAreasBySearchQuery.reduce((acc, vigilanceArea) => {
        acc[vigilanceArea.id] = vigilanceArea

        return acc
      }, {} as Record<string, VigilanceArea.VigilanceArea>),
      ids: vigilanceAreasBySearchQuery.map(vigilanceArea => vigilanceArea.id)
    }
  }, [
    data?.entities,
    filteredVigilanceAreaPeriod,
    vigilanceAreaSpecificPeriodFilter,
    searchQuery,
    createdBy,
    seaFronts,
    status,
    filteredRegulatoryThemes
  ])

  return { isError, isFetching, isLoading, vigilanceAreas: filteredVigilanceAreas }
}
