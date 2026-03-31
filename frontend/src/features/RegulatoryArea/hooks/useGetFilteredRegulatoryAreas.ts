import { useGetRegulatoryAreasQuery } from '@api/regulatoryAreasAPI'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
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
  const { bbox, zoom } = useAppSelector(state => state.map.mapView)

  const apiFilters = useMemo(
    () => ({
      bbox:
        shouldFilterSearchOnMapExtent && searchExtent
          ? transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
          : bbox,
      controlPlan,
      onlyRecentsAreas: areRecentsAreasChecked,
      searchQuery: globalSearchText,
      tags: getTagIds(filteredRegulatoryTags),
      themes: getThemeIds(filteredRegulatoryThemes),
      withGeometry: shouldFilterSearchOnMapExtent,
      zoom
    }),
    [
      areRecentsAreasChecked,
      shouldFilterSearchOnMapExtent,
      searchExtent,
      bbox,
      controlPlan,
      globalSearchText,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      zoom
    ]
  )
  const hasNoFilters = useMemo(
    () =>
      !apiFilters.controlPlan &&
      !apiFilters.searchQuery &&
      apiFilters.tags?.length === 0 &&
      apiFilters.themes?.length === 0 &&
      !apiFilters.onlyRecentsAreas &&
      !apiFilters.zoom &&
      !apiFilters.bbox,
    [apiFilters]
  )

  const { data, isError, isFetching, isLoading } = useGetRegulatoryAreasQuery(hasNoFilters ? undefined : apiFilters)

  const flattenRegulatoryAreas = useMemo(() => {
    if (!data?.regulatoryAreasByLayer) {
      return undefined
    }

    return data.regulatoryAreasByLayer.flatMap(layer => layer.regulatoryAreas)
  }, [data?.regulatoryAreasByLayer])

  let nextRegulatoryAreaIds: number[] | undefined
  if (searchExtent && shouldFilterSearchOnMapExtent) {
    nextRegulatoryAreaIds = getIntersectingLayerIds(shouldFilterSearchOnMapExtent, flattenRegulatoryAreas, searchExtent)
  }

  const results = useMemo(() => {
    if (!nextRegulatoryAreaIds) {
      return {
        regulatoryAreas: data?.regulatoryAreasByLayer || [],
        totalCount: data?.totalCount || 0
      }
    }

    const filteredRegulatoryAreas = data?.regulatoryAreasByLayer
      .map(layer => ({
        ...layer,
        regulatoryAreas: layer.regulatoryAreas.filter(area => nextRegulatoryAreaIds?.includes(area.id))
      }))
      .filter(layer => layer.regulatoryAreas.length > 0)

    return {
      regulatoryAreas: filteredRegulatoryAreas || [],
      totalCount: filteredRegulatoryAreas?.reduce((acc, layer) => acc + layer.regulatoryAreas.length, 0) || 0
    }
  }, [data?.regulatoryAreasByLayer, data?.totalCount, nextRegulatoryAreaIds])

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
