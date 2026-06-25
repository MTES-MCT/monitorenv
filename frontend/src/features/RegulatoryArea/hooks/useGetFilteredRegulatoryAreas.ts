import { useGetRegulatoryAreasQuery } from '@api/regulatoryAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getTagIds } from '@utils/getTagsAsOptions'
import { getThemeIds } from '@utils/getThemesAsOptions'
import { transformExtent } from 'ol/proj'
import { useMemo } from 'react'

export const useGetFilteredRegulatoryAreas = () => {
  const {
    areRecentsAreasChecked,
    controlPlan,
    filteredRegulatoryTags,
    filteredRegulatoryThemes,
    globalSearchText,
    searchExtent,
    shouldFilterSearchOnMapExtent
  } = useAppSelector(state => state.layerSearch)

  const apiFilters = useMemo(
    () => ({
      controlPlan,
      extent:
        shouldFilterSearchOnMapExtent && searchExtent
          ? transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
          : undefined,
      onlyRecentsAreas: areRecentsAreasChecked,
      searchQuery: globalSearchText,
      tags: getTagIds(filteredRegulatoryTags),
      themes: getThemeIds(filteredRegulatoryThemes)
    }),
    [
      controlPlan,
      areRecentsAreasChecked,
      globalSearchText,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      shouldFilterSearchOnMapExtent,
      searchExtent
    ]
  )
  const hasNoFilters = useMemo(
    () =>
      !apiFilters.controlPlan &&
      !apiFilters.searchQuery &&
      apiFilters.tags?.length === 0 &&
      apiFilters.themes?.length === 0 &&
      !apiFilters.onlyRecentsAreas &&
      apiFilters.extent?.length === 0,
    [apiFilters]
  )

  const { data, isError, isFetching, isLoading } = useGetRegulatoryAreasQuery(hasNoFilters ? undefined : apiFilters)

  const results = useMemo(
    () => ({
      regulatoryAreas: data?.regulatoryAreasByLayer || [],
      totalCount: data?.totalCount || 0
    }),
    [data?.regulatoryAreasByLayer, data?.totalCount]
  )

  const filteredAndFlattenRegulatoryAreas = useMemo(() => {
    if (!results.regulatoryAreas) {
      return undefined
    }

    return results.regulatoryAreas.flatMap(layer => layer.regulatoryAreas)
  }, [results.regulatoryAreas])

  return {
    flattenRegulatoryAreas: filteredAndFlattenRegulatoryAreas,
    isError,
    isFetching,
    isLoading,
    regulatoryAreas: results?.regulatoryAreas,
    totalCount: results?.totalCount
  }
}
