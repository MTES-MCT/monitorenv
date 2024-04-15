import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryLayers({ map }: BaseMapChildrenProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))

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
            name: Layers.REGULATORY_ENV_PREVIEW.code
          },
          renderBuffer: 4,
          renderOrder: (a, b) => b.get('area') - a.get('area'),
          source: getVectorSource(),
          style: getRegulatoryLayerStyle,
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
      if (regulatoryLayers?.entities) {
        const features = showedRegulatoryLayerIds.reduce((feats: Feature[], regulatorylayerId) => {
          const regulatorylayer = regulatoryLayers.entities[regulatorylayerId]
          if (regulatorylayer) {
            const { geom, ...regulatoryLayerProperties } = regulatorylayer
            const feature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(geom)
            feature.setId(`${Layers.REGULATORY_ENV.code}:${regulatorylayer.id}`)
            const geometry = feature.getGeometry()
            const area = geometry && getArea(geometry)
            feature.setProperties({ area, ...regulatoryLayerProperties })

            feats.push(feature)
          }

          return feats
        }, [])
        getVectorSource().addFeatures(features)
      }
    }
  }, [map, regulatoryLayers, showedRegulatoryLayerIds])

  useEffect(() => {
    if (map) {
      const features = getVectorSource().getFeatures()
      if (features?.length) {
        features.forEach(feature => {
          feature.set(metadataIsShowedPropertyName, feature.get('id') === regulatoryMetadataLayerId)
        })
      }
    }
  }, [map, regulatoryMetadataLayerId])

  return null
}
