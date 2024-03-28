import GeoJSON from 'ol/format/GeoJSON'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPLayers({ map }: BaseMapChildrenProps) {
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)

  const { data: ampLayers } = useGetAMPsQuery()

  const vectorSourceRef = useRef() as MutableRefObject<VectorSource>
  function getVectorSource() {
    if (!vectorSourceRef.current) {
      vectorSourceRef.current = new VectorSource({
        features: []
      })
    }

    return vectorSourceRef.current
  }
  const layerRef = useRef() as MutableRefObject<Vector<VectorSource>>

  useEffect(() => {
    function getLayer() {
      if (!layerRef.current) {
        layerRef.current = new Vector({
          properties: {
            name: Layers.AMP.code
          },
          renderBuffer: 4,
          renderOrder: (a, b) => b.get('area') - a.get('area'),
          source: getVectorSource(),
          style: getAMPLayerStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        })
      }

      return layerRef.current
    }
    if (map) {
      map.getLayers().push(getLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(getLayer())
      }
    }
  }, [map])

  useEffect(() => {
    if (map) {
      getVectorSource().clear()
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

        getVectorSource().addFeatures(features)
      }
    }
  }, [map, ampLayers, showedAmpLayerIds])

  return null
}
