import { useGetFilteredVigilanceAreasQuery } from '@features/VigilanceArea/hooks/useGetFilteredVigilanceAreasQuery'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function PreviewVigilanceAreasLayer({ map }: BaseMapChildrenProps) {
  const displayVigilanceAreaLayer = useAppSelector(state => state.global.displayVigilanceAreaLayer)

  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)
  const isVigilanceAreaSearchResultsVisible = useAppSelector(
    state => state.layerSearch.isVigilanceAreaSearchResultsVisible
  )
  const isLayersSidebarVisible = useAppSelector(state => state.global.isLayersSidebarVisible)
  const isLayerVisible = displayVigilanceAreaLayer && isVigilanceAreaSearchResultsVisible && isLayersSidebarVisible

  const { vigilanceAreas } = useGetFilteredVigilanceAreasQuery()

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
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.VIGILANCE_AREA_PREVIEW.code

  const vigilanceAreasFeatures = useMemo(() => {
    let features: Feature[] = []
    if (vigilanceAreaSearchResult && vigilanceAreas) {
      features = vigilanceAreaSearchResult.reduce((amplayers, id) => {
        const layer = vigilanceAreas.entities[id]

        if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
          const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA_PREVIEW.code)

          amplayers.push(feature)
        }

        return amplayers
      }, [] as Feature[])
    }

    return features
  }, [vigilanceAreaSearchResult, vigilanceAreas])

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
}
