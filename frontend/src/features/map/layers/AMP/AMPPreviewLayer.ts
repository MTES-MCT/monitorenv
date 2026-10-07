import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import { getQueryString } from '@utils/getQueryStringFormatted'
import MVT from 'ol/format/MVT'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { useDebounce } from 'use-debounce'

import { getAMPLayerStyle } from './AMPLayers.style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorTileLayerWithName } from 'domain/types/layer'

export function AMPPreviewLayer({ map }: BaseMapChildrenProps) {
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))
  const ampMetadataLayerIdRef = useRef(ampMetadataLayerId)
  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const isolatedLayerRef = useRef(isolatedLayer)

  const { isLayersSidebarVisible } = useAppSelector(state => state.global.visibility)
  const isAmpSearchResultsVisible = useAppSelector(state => state.layerSearch.isAmpSearchResultsVisible)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLayerVisible = isLayersSidebarVisible && isAmpSearchResultsVisible && !isLinkingRegulatoryToVigilanceArea

  const { areRecentsAreasChecked, globalSearchText, searchExtent, shouldFilterSearchOnMapExtent } = useAppSelector(
    state => state.layerSearch
  )

  const apiFilters = useMemo(
    () => ({
      extent: shouldFilterSearchOnMapExtent && searchExtent ? searchExtent : undefined,
      onlyRecentsAreas: areRecentsAreasChecked,
      searchQuery: globalSearchText
    }),
    [areRecentsAreasChecked, globalSearchText, shouldFilterSearchOnMapExtent, searchExtent]
  )

  const [debounceFilters] = useDebounce(apiFilters, 500)

  const hasNoFilters = useMemo(
    () => !debounceFilters.searchQuery && !debounceFilters.onlyRecentsAreas && debounceFilters.extent?.length === 0,
    [debounceFilters]
  )

  const ampPreviewVectorSourceRef = useRef(
    new VectorTileSource({
      format: new MVT(),
      url: getQueryString('/bff/v1/amps/tiles/{z}/{x}/{y}', hasNoFilters ? undefined : debounceFilters)
    })
  ) as MutableRefObject<VectorTileSource>
  const ampPreviewVectorLayerRef = useRef(
    new VectorTileLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: ampPreviewVectorSourceRef.current,
      style: feature => getAMPLayerStyle(feature, isolatedLayerRef.current, ampMetadataLayerIdRef.current)
    })
  ) as MutableRefObject<VectorTileLayerWithName>
  ampPreviewVectorLayerRef.current.name = Layers.AMP_PREVIEW.code

  useEffect(() => {
    isolatedLayerRef.current = isolatedLayer
    ampMetadataLayerIdRef.current = ampMetadataLayerId
    // force layer rerender
    ampPreviewVectorLayerRef.current.changed()
  }, [isolatedLayer, ampMetadataLayerId])

  useEffect(() => {
    if (!map) {
      return
    }

    const newSource = new VectorTileSource({
      format: new MVT({ idProperty: 'uid' }),
      url: getQueryString('/bff/v1/amps/tiles/{z}/{x}/{y}', hasNoFilters ? undefined : apiFilters)
    })

    ampPreviewVectorSourceRef.current = newSource
    ampPreviewVectorLayerRef.current.setSource(newSource)
  }, [apiFilters, hasNoFilters, map])

  useEffect(() => {
    ampPreviewVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    if (map) {
      map.getLayers().push(ampPreviewVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(ampPreviewVectorLayerRef.current)
      }
    }
  }, [map])

  return null
}
