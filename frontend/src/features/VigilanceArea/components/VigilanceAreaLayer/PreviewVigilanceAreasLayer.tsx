import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { dottedLayerStyle } from '@features/map/layers/styles/dottedLayer.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef, type MutableRefObject } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'
import { TWO_MINUTES } from '../../../../constants'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function PreviewVigilanceAreasLayer({ map }: BaseMapChildrenProps) {
  const displayVigilanceAreaLayer = useAppSelector(state => state.global.displayVigilanceAreaLayer)

  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)
  const isVigilanceAreaSearchResultsVisible = useAppSelector(
    state => state.layerSearch.isVigilanceAreaSearchResultsVisible
  )
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const myVigilanceAreaIdsDisplayed = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIdsDisplayed)

  const isThrottled = useRef(false)

  const isLayerVisible = displayVigilanceAreaLayer && isVigilanceAreaSearchResultsVisible

  const { data: vigilanceAreas } = useGetVigilanceAreasQuery(undefined, { pollingInterval: TWO_MINUTES })

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: vectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.VIGILANCE_AREA_PREVIEW.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.VIGILANCE_AREA_PREVIEW.code

  const seachExtentVectorSourceRef = useRef(new VectorSource())
  const searchExtentLayerRef = useRef(
    new Vector({
      source: seachExtentVectorSourceRef.current,
      style: dottedLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
  ) as MutableRefObject<Vector<VectorSource>>

  useEffect(() => {
    function refreshPreviewLayer() {
      vectorSourceRef.current.clear(true)
      if (vigilanceAreaSearchResult && vigilanceAreas) {
        const features = vigilanceAreaSearchResult.reduce((amplayers, id) => {
          const layer = vigilanceAreas.entities[id]

          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA_PREVIEW.code)

            amplayers.push(feature)
          }

          return amplayers
        }, [] as Feature[])

        vectorSourceRef.current.addFeatures(features)
      }
    }

    if (map) {
      if (isThrottled.current) {
        return
      }

      isThrottled.current = true

      window.setTimeout(() => {
        isThrottled.current = false
        refreshPreviewLayer()
      }, 300)
    }
  }, [map, vigilanceAreaSearchResult, vigilanceAreas, myVigilanceAreaIdsDisplayed])

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)
    map.getLayers().push(searchExtentLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(searchExtentLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    if (map) {
      seachExtentVectorSourceRef.current.clear()
      if (searchExtent) {
        const feature = new Feature(fromExtent(searchExtent))
        seachExtentVectorSourceRef.current.addFeature(feature)
      }
    }
  }, [map, searchExtent])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
    searchExtentLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
