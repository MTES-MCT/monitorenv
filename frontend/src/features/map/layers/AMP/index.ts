import GeoJSON from 'ol/format/GeoJSON'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { useEffect, useRef } from 'react'

import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPLayers({ map }: BaseMapChildrenProps) {
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)

  const { data: ampLayers } = useGetAMPsQuery()

  const vectorSourceRef = useRef(new VectorSource())

  const layerRef = useRef<VectorLayerWithName>(
    new Vector({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: vectorSourceRef.current,
      style: getAMPLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
  )
  layerRef.current.name = Layers.AMP.code

  useEffect(() => {
    const layer = layerRef.current
    if (map) {
      map.getLayers().push(layerRef.current)
    }

    return () => {
      if (map) {
        map.removeLayer(layer)
      }
    }
  }, [map])

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear()
      if (ampLayers?.entities) {
        const features = showedAmpLayerIds.reduce((feats: Feature[], layerId) => {
          const ampLayer = ampLayers.entities[layerId]
          if (ampLayer) {
            const { geom, ...ampLayerProperties } = ampLayer
            const feature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(ampLayer.geom)
            feature.setId(`${Layers.AMP.code}:${ampLayer.id}`)
            const geometry = feature.getGeometry()
            const area = geometry && getArea(geometry)
            feature.setProperties({ area, ...ampLayerProperties })

            feats.push(feature)
          }

          return feats
        }, [])

        vectorSourceRef.current.addFeatures(features)
      }
    }
  }, [map, ampLayers, showedAmpLayerIds])

  return null
}
