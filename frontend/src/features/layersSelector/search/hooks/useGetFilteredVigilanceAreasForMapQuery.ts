import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { isVigilanceAreaPartOfStatus } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfStatus'
import { isVigilanceAreaPartOfTag } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfTag'
import { isVigilanceAreaPartOfTheme } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfTheme'
import { isVigilanceAreaPartOfVisibility } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfVisibility'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../../constants'

export const useGetFilteredVigilanceAreasForMapQuery = (skip = false) => {
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = useMemo(() => user?.isSuperUser, [user])

  const { status, visibility } = useAppSelector(state => state.vigilanceAreaFilters)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)
  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const { data, isError, isFetching, isLoading } = useGetVigilanceAreasQuery(undefined, {
    pollingInterval: TWO_MINUTES,
    skip
  })

  const filteredVigilanceAreas = useMemo(() => {
    if (!data?.entities) {
      return { entities: {}, ids: [] }
    }

    const vigilanceAreas = Object.values(data.entities)

    const tempVigilanceAreas = vigilanceAreas.filter(
      vigilanceArea =>
        isVigilanceAreaPartOfStatus(vigilanceArea, isSuperUser ? status : [VigilanceArea.Status.PUBLISHED]) &&
        isVigilanceAreaPartOfTag(vigilanceArea, filteredRegulatoryTags) &&
        isVigilanceAreaPartOfTheme(vigilanceArea, filteredRegulatoryThemes) &&
        isVigilanceAreaPartOfVisibility(vigilanceArea, isSuperUser ? visibility : [VigilanceArea.Visibility.PUBLIC])
    )

    const vigilanceAreasByPeriod = getFilterVigilanceAreasPerPeriod(
      tempVigilanceAreas,
      filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter,
      isSuperUser
    )

    const sortedVigilanceAreas = [...vigilanceAreasByPeriod]
    const vigilanceAreasEntities = sortedVigilanceAreas.reduce((acc, vigilanceArea) => {
      acc[vigilanceArea.id] = vigilanceArea

      return acc
    }, {} as Record<string, VigilanceArea.VigilanceAreaLayer>)

    return {
      entities: vigilanceAreasEntities,
      ids: vigilanceAreasByPeriod.map(vigilanceArea => vigilanceArea.id)
    }
  }, [
    data?.entities,
    filteredVigilanceAreaPeriod,
    vigilanceAreaSpecificPeriodFilter,
    isSuperUser,
    status,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    visibility
  ])

  return { isError, isFetching, isLoading, vigilanceAreas: filteredVigilanceAreas }
}
