import { useGetFilteredVigilanceAreasForMapQuery } from '@features/layersSelector/search/hooks/useGetFilteredVigilanceAreasForMapQuery'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { memo, useEffect, useMemo, useRef } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const PreviewVigilanceAreasLayer = memo(() => {
  const { map } = useMapContext()
  const displayVigilanceAreaLayer = useAppSelector(state => state.global.layers.displayVigilanceAreaLayer)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)
  const isVigilanceAreaSearchResultsVisible = useAppSelector(
    state => state.layerSearch.isVigilanceAreaSearchResultsVisible
  )
  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const isLayerVisible = useMemo(
    () => displayVigilanceAreaLayer && isVigilanceAreaSearchResultsVisible && isLayersSidebarVisible,
    [displayVigilanceAreaLayer, isVigilanceAreaSearchResultsVisible, isLayersSidebarVisible]
  )

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const { vigilanceAreas } = useGetFilteredVigilanceAreasForMapQuery()

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: vectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      zIndex: Layers.VIGILANCE_AREA_PREVIEW.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.VIGILANCE_AREA_PREVIEW.code

  const vigilanceAreasFeatures = useMemo(() => {
    let features: Feature[] = []
    if (vigilanceAreaSearchResult ?? vigilanceAreas) {
      const vigilanceAreasToDisplay = vigilanceAreaSearchResult ?? vigilanceAreas?.ids ?? []

      features = vigilanceAreasToDisplay.reduce((layers, id) => {
        if (id === editingVigilanceAreaId) {
          return layers
        }
        const layer = vigilanceAreas?.entities[id]

        if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
          const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA_PREVIEW.code, isolatedLayer)

          layers.push(feature)
        }

        return layers
      }, [] as Feature[])
    }

    return features
  }, [isolatedLayer, vigilanceAreaSearchResult, vigilanceAreas, editingVigilanceAreaId])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    if (vigilanceAreasFeatures) {
      vectorSourceRef.current?.addFeatures(vigilanceAreasFeatures)
    }
  }, [vigilanceAreasFeatures])

  useEffect(() => {
    if (map) {
      vectorLayerRef.current?.setVisible(isLayerVisible)
    }
  }, [map, isLayerVisible])

  useEffect(() => {
    if (map) {
      map.getLayers().push(vectorLayerRef.current)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(vectorLayerRef.current)
      }
    }

    return () => {}
  }, [map])

  return null
})
