import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getFilterVigilanceAreasPerPeriod } from '@features/layersSelector/utils/getFilteredVigilanceAreasPerPeriod'
import { getIntersectingLayers } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { isVigilanceAreaPartOfType } from '@features/VigilanceArea/useCases/filters/isVigilanceAreaPartOfType'
import { useAppSelector } from '@hooks/useAppSelector'
import { CustomSearch } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

import { TWO_MINUTES } from '../../../constants'
import { VigilanceArea } from '../types'
import { isVigilanceAreaPartOfCreatedBy } from '../useCases/filters/isVigilanceAreaPartOfCreatedBy'
import { isVigilanceAreaPartOfSeaFront } from '../useCases/filters/isVigilanceAreaPartOfSeaFront'
import { isVigilanceAreaPartOfStatus } from '../useCases/filters/isVigilanceAreaPartOfStatus'
import { isVigilanceAreaPartOfTag } from '../useCases/filters/isVigilanceAreaPartOfTag'
import { isVigilanceAreaPartOfTheme } from '../useCases/filters/isVigilanceAreaPartOfTheme'
import { isVigilanceAreaPartOfVisibility } from '../useCases/filters/isVigilanceAreaPartOfVisibility'

export const useGetFilteredVigilanceAreasQuery = () => {
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  const { createdBy, period, seaFronts, specificPeriod, status, type, visibility } = useAppSelector(
    state => state.vigilanceAreaFilters
  )

  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const { data, isError, isFetching, isLoading } = useGetVigilanceAreasQuery(undefined, {
    pollingInterval: TWO_MINUTES
  })

  const vigilanceAreas = useMemo(() => (data ? Object.values(data?.entities) : []), [data])

  const tempVigilanceAreas = useMemo(
    () =>
      vigilanceAreas.filter(
        vigilanceArea =>
          isVigilanceAreaPartOfCreatedBy(vigilanceArea, createdBy) &&
          isVigilanceAreaPartOfSeaFront(vigilanceArea, seaFronts) &&
          isVigilanceAreaPartOfStatus(vigilanceArea, isSuperUser ? status : [VigilanceArea.Status.PUBLISHED]) &&
          isVigilanceAreaPartOfTag(vigilanceArea, filteredRegulatoryTags) &&
          isVigilanceAreaPartOfTheme(vigilanceArea, filteredRegulatoryThemes) &&
          isVigilanceAreaPartOfVisibility(vigilanceArea, visibility) &&
          isVigilanceAreaPartOfType(vigilanceArea, type)
      ),
    [
      vigilanceAreas,
      createdBy,
      seaFronts,
      isSuperUser,
      status,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      visibility,
      type
    ]
  )

  const vigilanceAreasByPeriod = useMemo(
    () => getFilterVigilanceAreasPerPeriod(tempVigilanceAreas, period, specificPeriod, type, isSuperUser),
    [tempVigilanceAreas, period, specificPeriod, type, isSuperUser]
  )

  const filteredVigilanceAreas = useMemo(() => {
    if (!vigilanceAreas) {
      return { entities: {}, ids: [] }
    }

    let vigilanceAreasFilteredByUserType = vigilanceAreasByPeriod
    if (!isSuperUser) {
      vigilanceAreasFilteredByUserType = tempVigilanceAreas.filter(
        vigilanceArea => !vigilanceArea.isDraft && vigilanceArea.visibility === VigilanceArea.Visibility.PUBLIC
      )
    }

    if (globalSearchText && globalSearchText.trim().length > 0) {
      const customSearch = new CustomSearch(
        vigilanceAreasFilteredByUserType,
        [
          { name: 'comments', weight: 0.1 },
          { name: 'name', weight: 0.9 },
          { name: 'tags.name', weight: 0.5 },
          { name: 'tags.subTags.name', weight: 0.5 },
          { name: 'themes.name', weight: 0.5 },
          { name: 'themes.subThemes.name', weight: 0.5 }
        ],
        {
          cacheKey: 'VIGILANCE_AREAS_LIST_SEARCH',
          isStrict: true,
          withCacheInvalidation: true
        }
      )
      vigilanceAreasFilteredByUserType = customSearch.find(globalSearchText)
    }

    let searchedVigilanceAreasInExtent: VigilanceArea.VigilanceAreaLayer[] = vigilanceAreasFilteredByUserType
    if (shouldFilterSearchOnMapExtent && searchExtent) {
      const vigilanceAreaSchema = { bboxPath: 'bbox' }
      searchedVigilanceAreasInExtent = getIntersectingLayers<VigilanceArea.VigilanceAreaLayer>(
        shouldFilterSearchOnMapExtent,
        vigilanceAreasFilteredByUserType,
        searchExtent,
        vigilanceAreaSchema
      )
    }

    const sortedVigilanceAreas = [...searchedVigilanceAreasInExtent].sort((a, b) => a?.name?.localeCompare(b?.name))
    const vigilanceAreasEntities = sortedVigilanceAreas.reduce((acc, vigilanceArea) => {
      acc[vigilanceArea.id] = vigilanceArea

      return acc
    }, {} as Record<string, VigilanceArea.VigilanceAreaLayer>)

    return {
      entities: vigilanceAreasEntities,
      ids: searchedVigilanceAreasInExtent.map(vigilanceArea => vigilanceArea.id)
    }
  }, [
    vigilanceAreas,
    vigilanceAreasByPeriod,
    isSuperUser,
    globalSearchText,
    shouldFilterSearchOnMapExtent,
    searchExtent,
    tempVigilanceAreas
  ])

  return { isError, isFetching, isLoading, vigilanceAreas: filteredVigilanceAreas }
}
