import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { useAppSelector } from '@hooks/useAppSelector'
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
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

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

  const tempVigilanceAreas = useMemo(
    () =>
      vigilanceAreas.filter(
        vigilanceArea =>
          isVigilanceAreaPartOfCreatedBy(vigilanceArea, createdBy) &&
          isVigilanceAreaPartOfSeaFront(vigilanceArea, seaFronts) &&
          isVigilanceAreaPartOfStatus(vigilanceArea, isSuperUser ? status : [VigilanceArea.Status.PUBLISHED]) &&
          isVigilanceAreaPartOfTag(vigilanceArea, filteredRegulatoryTags) &&
          isVigilanceAreaPartOfTheme(vigilanceArea, filteredRegulatoryThemes) &&
          isVigilanceAreaPartOfVisibility(vigilanceArea, visibility)
      ),
    [
      vigilanceAreas,
      createdBy,
      seaFronts,
      isSuperUser,
      status,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      visibility
    ]
  )

  const vigilanceAreasByPeriod = useMemo(
    () =>
      getFilterVigilanceAreasPerPeriod(
        tempVigilanceAreas,
        filteredVigilanceAreaPeriod,
        vigilanceAreaSpecificPeriodFilter,
        isSuperUser
      ),
    [tempVigilanceAreas, filteredVigilanceAreaPeriod, vigilanceAreaSpecificPeriodFilter, isSuperUser]
  )

  const filteredVigilanceAreas = useMemo(() => {
    if (!vigilanceAreas) {
      return { entities: {}, ids: [] }
    }

    const customSearch = new CustomSearch(
      structuredClone(vigilanceAreasByPeriod),
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
  }, [vigilanceAreas, vigilanceAreasByPeriod, isSuperUser, searchQuery, tempVigilanceAreas])

  return { isError, isFetching, isLoading, vigilanceAreas: filteredVigilanceAreas }
}
