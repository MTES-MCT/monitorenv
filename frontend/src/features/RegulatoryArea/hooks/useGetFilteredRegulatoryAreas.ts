import { useGetRegulatoryAreasQuery } from '@api/regulatoryAreasAPI'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getTagIds } from '@utils/getTagsAsOptions'
import { getThemeIds } from '@utils/getThemesAsOptions'
import { transformExtent } from 'ol/proj'
import { useMemo } from 'react'

import type { RegulatoryArea } from '../types'

const EMPTY_ARRAY: never[] = []

export const useGetFilteredRegulatoryAreas = ({
  skip = false,
  withGeometry = true
}: {
  skip?: boolean
  withGeometry?: boolean
}) => {
  const areRecentsAreasChecked = useAppSelector(state => state.layerSearch.areRecentsAreasChecked)
  const controlPlan = useAppSelector(state => state.layerSearch.controlPlan)
  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const bbox = useAppSelector(state => state.map.mapView.bbox)
  const zoom = useAppSelector(state => state.map.mapView.zoom)
  const shouldSearchWithGeometry = (withGeometry || shouldFilterSearchOnMapExtent) ?? false

  const tagIds = useMemo(() => getTagIds(filteredRegulatoryTags) ?? EMPTY_ARRAY, [filteredRegulatoryTags])
  const themeIds = useMemo(() => getThemeIds(filteredRegulatoryThemes) ?? EMPTY_ARRAY, [filteredRegulatoryThemes])

  const resolvedBbox = useMemo(
    () =>
      shouldFilterSearchOnMapExtent && searchExtent
        ? transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
        : bbox,
    [bbox, searchExtent, shouldFilterSearchOnMapExtent]
  )

  const apiFilters = useMemo(
    () => ({
      bbox: shouldSearchWithGeometry ? resolvedBbox : undefined,
      controlPlan,
      onlyRecentsAreas: areRecentsAreasChecked,
      searchQuery: globalSearchText,
      tags: tagIds,
      themes: themeIds,
      withGeometry: shouldSearchWithGeometry,
      zoom: shouldSearchWithGeometry ? zoom : undefined
    }),
    [
      areRecentsAreasChecked,
      resolvedBbox,
      controlPlan,
      globalSearchText,
      tagIds,
      themeIds,
      shouldSearchWithGeometry,
      zoom
    ]
  )

  const { data, isError, isFetching, isLoading } = useGetRegulatoryAreasQuery(apiFilters, {
    skip
  })

  const flattenRegulatoryAreas = useMemo(() => {
    if (!data?.regulatoryAreasByLayer) {
      return undefined
    }

    return data.regulatoryAreasByLayer.flatMap(layer => layer.regulatoryAreas)
  }, [data?.regulatoryAreasByLayer])

  let nextRegulatoryAreaIds: number[] | undefined
  if (searchExtent && shouldFilterSearchOnMapExtent) {
    nextRegulatoryAreaIds = getIntersectingLayerIds(
      shouldFilterSearchOnMapExtent,
      flattenRegulatoryAreas as RegulatoryArea.RegulatoryAreaWithBbox[],
      searchExtent,
      undefined,
      true
    )
  }

  const results = useMemo(() => {
    if (!nextRegulatoryAreaIds) {
      return {
        regulatoryAreas: data?.regulatoryAreasByLayer || [],
        totalCount: data?.totalCount || 0
      }
    }

    const filteredregulatoryAreas = data?.regulatoryAreasByLayer
      .map(layer => ({
        ...layer,
        regulatoryAreas: layer.regulatoryAreas.filter(area => nextRegulatoryAreaIds?.includes(area.id))
      }))
      .filter(layer => layer.regulatoryAreas.length > 0)

    return {
      regulatoryAreas: filteredregulatoryAreas || [],
      totalCount: filteredregulatoryAreas?.reduce((acc, layer) => acc + layer.regulatoryAreas.length, 0) || 0
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
