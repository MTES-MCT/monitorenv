import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getIsolatedLayerIsVigilanceArea } from '@features/map/layers/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'
import { TWO_MINUTES } from '../../../../constants'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function VigilanceAreasLayer({ map }: BaseMapChildrenProps) {
  const displayVigilanceAreaLayer = useAppSelector(state => state.global.displayVigilanceAreaLayer)

  const myVigilanceAreaIdsDisplayed = useAppSelector(state => state.vigilanceArea.myVigilanceAreaIdsDisplayed)

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const isolatedLayerIsVigilanceArea = getIsolatedLayerIsVigilanceArea(isolatedLayer)
  const areLayersFilled = isolatedLayer === undefined

  const isLayerVisible = displayVigilanceAreaLayer

  const { data: vigilanceAreas } = useGetVigilanceAreasQuery(undefined, { pollingInterval: TWO_MINUTES })

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: vectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      zIndex: Layers.VIGILANCE_AREA.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.VIGILANCE_AREA.code

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (vigilanceAreas?.entities) {
        const features = myVigilanceAreaIdsDisplayed.reduce((feats: Feature[], layerId) => {
          const layer = vigilanceAreas.entities[layerId]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA.code, isolatedLayer)

            feats.push(feature)
          }

          return feats
        }, [])

        vectorSourceRef.current.addFeatures(features)
      }
    }
  }, [
    areLayersFilled,
    isolatedLayer,
    isolatedLayerIsVigilanceArea,
    map,
    myVigilanceAreaIdsDisplayed,
    vigilanceAreas?.entities
  ])

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
