import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
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
import { useDebounce } from 'use-debounce'

import { Layers } from '../../../../domain/entities/layers/constants'

import type { VectorTileLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea
  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const isolatedLayerRef = useRef(isolatedLayer)
  const regulatoryMetadataLayerIdRef = useRef(regulatoryMetadataLayerId)

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
      extent: shouldFilterSearchOnMapExtent && searchExtent ? searchExtent : undefined,
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

  const [debouceFilters] = useDebounce(apiFilters, 500)

  const hasNoFilters = useMemo(
    () =>
      !debouceFilters.controlPlan &&
      !debouceFilters.searchQuery &&
      debouceFilters.tags?.length === 0 &&
      debouceFilters.themes?.length === 0 &&
      !debouceFilters.onlyRecentsAreas &&
      debouceFilters.extent?.length === 0,
    [debouceFilters]
  )

  const regulatoryPreviewVectorSourceRef = useRef(
    new VectorTileSource({
      format: new MVT(),
      url: getQueryString('/bff/v1/regulatory-areas/tiles/{z}/{x}/{y}', hasNoFilters ? undefined : debouceFilters)
    })
  ) as MutableRefObject<VectorTileSource>

  const regulatoryPreviewVectorLayerRef = useRef(
    new VectorTileLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryPreviewVectorSourceRef.current,
      style: feature => getRegulatoryLayerStyle(feature, isolatedLayerRef.current, regulatoryMetadataLayerIdRef.current)
    })
  ) as MutableRefObject<VectorTileLayerWithName>
  regulatoryPreviewVectorLayerRef.current.name = Layers.REGULATORY_ENV_PREVIEW.code

  useEffect(() => {
    if (!map) {
      return () => {}
    }
    const view = map.getView()

    const baseFn = regulatoryPreviewVectorSourceRef.current.getTileUrlFunction()

    const gatedFn: typeof baseFn = (coord, ratio, proj) =>
      view.getAnimating() ? undefined : baseFn(coord, ratio, proj)

    regulatoryPreviewVectorSourceRef.current.setTileUrlFunction(gatedFn)

    // à la fin de l'animation, on relance le chargement
    const onMoveEnd = () => {
      if (!view.getAnimating()) {
        regulatoryPreviewVectorSourceRef.current.setTileUrlFunction(gatedFn) // vide le cache et recharge les tuiles visibles
      }
    }
    map.on('moveend', onMoveEnd)

    return () => {
      map.un('moveend', onMoveEnd)
      regulatoryPreviewVectorSourceRef.current.setTileUrlFunction(baseFn)
    }
  }, [map])

  useEffect(() => {
    isolatedLayerRef.current = isolatedLayer
    regulatoryMetadataLayerIdRef.current = regulatoryMetadataLayerId
    // force layer rerender
    regulatoryPreviewVectorLayerRef.current.changed()
  }, [isolatedLayer, regulatoryMetadataLayerId])

  useEffect(() => {
    if (!map) {
      return
    }

    const newSource = new VectorTileSource({
      format: new MVT({ idProperty: 'uid' }),
      url: getQueryString('/bff/v1/regulatory-areas/tiles/{z}/{x}/{y}', hasNoFilters ? undefined : apiFilters)
    })

    regulatoryPreviewVectorSourceRef.current = newSource
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
