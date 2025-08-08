import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { useGetVigilanceAreasWithFilters } from '@features/VigilanceArea/hooks/useGetVigilanceAreasWithFilters'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { isVigilanceAreaPartOfStatus } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfStatus'
import { isVigilanceAreaPartOfTag } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfTag'
import { isVigilanceAreaPartOfTheme } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfTheme'
import { isVigilanceAreaPartOfVisibility } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfVisibility'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMemo } from 'react'

export const useGetFilteredVigilanceAreasForMapQuery = () => {
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  const { status, visibility } = useAppSelector(state => state.vigilanceAreaFilters)

  const {
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    filteredVigilanceAreaPeriod,
    isError,
    isFetching,
    isLoading,
    vigilanceAreas,
    vigilanceAreaSpecificPeriodFilter
  } = useGetVigilanceAreasWithFilters()

  const tempVigilanceAreas = useMemo(
    () =>
      vigilanceAreas.filter(
        vigilanceArea =>
          isVigilanceAreaPartOfStatus(vigilanceArea, isSuperUser ? status : [VigilanceArea.Status.PUBLISHED]) &&
          isVigilanceAreaPartOfTag(vigilanceArea, filteredRegulatoryTags) &&
          isVigilanceAreaPartOfTheme(vigilanceArea, filteredRegulatoryThemes) &&
          isVigilanceAreaPartOfVisibility(vigilanceArea, isSuperUser ? visibility : [VigilanceArea.Visibility.PUBLIC])
      ),
    [vigilanceAreas, isSuperUser, status, filteredRegulatoryTags, filteredRegulatoryThemes, visibility]
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

    const sortedVigilanceAreas = [...vigilanceAreasByPeriod]
    const vigilanceAreasEntities = sortedVigilanceAreas.reduce((acc, vigilanceArea) => {
      acc[vigilanceArea.id] = vigilanceArea

      return acc
    }, {} as Record<string, VigilanceArea.VigilanceAreaLayer>)

    return {
      entities: vigilanceAreasEntities,
      ids: vigilanceAreasByPeriod.map(vigilanceArea => vigilanceArea.id)
    }
  }, [vigilanceAreas, vigilanceAreasByPeriod])

  return { isError, isFetching, isLoading, vigilanceAreas: filteredVigilanceAreas }
}
