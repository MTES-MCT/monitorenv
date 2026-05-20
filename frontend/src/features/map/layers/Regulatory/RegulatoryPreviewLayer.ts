import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import { useAppSelector } from '@hooks/useAppSelector'
import { getQueryString } from '@utils/getQueryStringFormatted'
import { getTagIds } from '@utils/getTagsAsOptions'
import { getThemeIds } from '@utils/getThemesAsOptions'
import MVT from 'ol/format/MVT'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'

import type { VectorTileLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea

  const { areRecentsAreasChecked, controlPlan, filteredRegulatoryTags, filteredRegulatoryThemes, globalSearchText } =
    useAppSelector(state => state.layerSearch)

  const apiFilters = useMemo(
    () => ({
      controlPlan,
      onlyRecentsAreas: areRecentsAreasChecked,
      searchQuery: globalSearchText,
      tags: getTagIds(filteredRegulatoryTags),
      themes: getThemeIds(filteredRegulatoryThemes)
    }),
    [controlPlan, globalSearchText, filteredRegulatoryTags, filteredRegulatoryThemes, areRecentsAreasChecked]
  )

  const hasNoFilters = useMemo(
    () =>
      !apiFilters.controlPlan &&
      !apiFilters.searchQuery &&
      apiFilters.tags?.length === 0 &&
      apiFilters.themes?.length === 0 &&
      !apiFilters.onlyRecentsAreas,
    [apiFilters]
  )

  const regulatoryPreviewVectorSourceRef = useRef(
    new VectorTileSource({
      format: new MVT(),
      url: getQueryString('/bff/v1/regulatory-areas/tiles/{z}/{x}/{y}', hasNoFilters ? undefined : apiFilters)
    })
  ) as MutableRefObject<VectorTileSource>

  const regulatoryPreviewVectorLayerRef = useRef(
    new VectorTileLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryPreviewVectorSourceRef.current,
      style: getRegulatoryLayerStyle
    })
  ) as MutableRefObject<VectorTileLayerWithName>
  regulatoryPreviewVectorLayerRef.current.name = Layers.REGULATORY_ENV_PREVIEW.code

  useEffect(() => {
    if (!map) {
      return
    }

    const newSource = new VectorTileSource({
      format: new MVT({ idProperty: 'id' }),
      url: getQueryString('/bff/v1/regulatory-areas/tiles/{z}/{x}/{y}', hasNoFilters ? undefined : apiFilters)
    })

    regulatoryPreviewVectorSourceRef.current = newSource
    regulatoryPreviewVectorLayerRef.current.name = Layers.REGULATORY_ENV_PREVIEW.code
    regulatoryPreviewVectorLayerRef.current.setSource(newSource)
  }, [apiFilters, hasNoFilters, map])

  useEffect(() => {
    if (map) {
      regulatoryPreviewVectorLayerRef.current?.setVisible(isLayerVisible)
    }
  }, [map, isLayerVisible])

  useEffect(() => {
    if (map) {
      const regRef = regulatoryPreviewVectorLayerRef.current
      map.getLayers().push(regRef)

      return () => {
        map.removeLayer(regRef)
      }
    }

    return () => {}
  }, [map])

  return null
}
