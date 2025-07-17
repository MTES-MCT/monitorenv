import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { CustomSearch } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

import { VigilanceArea } from '../types'
import { useGetVigilanceAreasWithFilters } from './useGetVigilanceAreasWithFilters'
import { isVigilanceAreaPartOfCreatedBy } from '../useCases/filters/isVigilanceAreaPartOfCreatedBy'
import { isVigilanceAreaPartOfSeaFront } from '../useCases/filters/isVigilanceAreaPartOfSeaFront'
import { isVigilanceAreaPartOfStatus } from '../useCases/filters/isVigilanceAreaPartOfStatus'
import { isVigilanceAreaPartOfTag } from '../useCases/filters/isVigilanceAreaPartOfTag'
import { isVigilanceAreaPartOfTheme } from '../useCases/filters/isVigilanceAreaPartOfTheme'
import { isVigilanceAreaPartOfVisibility } from '../useCases/filters/isVigilanceAreaPartOfVisibility'

export const useGetFilteredVigilanceAreasQuery = (skip = false) => {
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = user?.isSuperUser ?? true

  const { createdBy, seaFronts, searchQuery, status, visibility } = useAppSelector(state => state.vigilanceAreaFilters)

  const {
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    filteredVigilanceAreaPeriod,
    isError,
    isFetching,
    isLoading,
    vigilanceAreas,
    vigilanceAreaSpecificPeriodFilter
  } = useGetVigilanceAreasWithFilters(skip)

  const filteredVigilanceAreas = useMemo(() => {
    if (!vigilanceAreas) {
      return { entities: {}, ids: [] }
    }

    const tempVigilanceAreas = vigilanceAreas.filter(
      vigilanceArea =>
        isVigilanceAreaPartOfCreatedBy(vigilanceArea, createdBy) &&
        isVigilanceAreaPartOfSeaFront(vigilanceArea, seaFronts) &&
        isVigilanceAreaPartOfStatus(vigilanceArea, isSuperUser ? status : [VigilanceArea.Status.PUBLISHED]) &&
        isVigilanceAreaPartOfTag(vigilanceArea, filteredRegulatoryTags) &&
        isVigilanceAreaPartOfTheme(vigilanceArea, filteredRegulatoryThemes) &&
        isVigilanceAreaPartOfVisibility(vigilanceArea, visibility)
    )

    const vigilanceAreasByPeriod = getFilterVigilanceAreasPerPeriod(
      tempVigilanceAreas,
      filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter,
      isSuperUser
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

    let vigilanceAreasFilteredByUserType = vigilanceAreasByPeriod
    if (!isSuperUser) {
      vigilanceAreasFilteredByUserType = tempVigilanceAreas.filter(
        vigilanceArea => !vigilanceArea.isDraft && vigilanceArea.visibility === VigilanceArea.Visibility.PUBLIC
      )
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      vigilanceAreasFilteredByUserType = customSearch.find(searchQuery)
    }

    const sortedVigilanceAreas = [...vigilanceAreasFilteredByUserType].sort((a, b) => a?.name?.localeCompare(b?.name))
    const vigilanceAreasEntities = sortedVigilanceAreas.reduce((acc, vigilanceArea) => {
      acc[vigilanceArea.id] = vigilanceArea

      return acc
    }, {} as Record<string, VigilanceArea.VigilanceAreaLayer>)

    return {
      entities: vigilanceAreasEntities,
      ids: vigilanceAreasFilteredByUserType.map(vigilanceArea => vigilanceArea.id)
    }
  }, [
    vigilanceAreas,
    filteredVigilanceAreaPeriod,
    vigilanceAreaSpecificPeriodFilter,
    isSuperUser,
    searchQuery,
    createdBy,
    seaFronts,
    status,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    visibility
  ])

  return { isError, isFetching, isLoading, vigilanceAreas: filteredVigilanceAreas }
}
