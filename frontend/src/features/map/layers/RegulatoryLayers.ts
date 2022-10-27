import GeoJSON from 'ol/format/GeoJSON'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { MutableRefObject, useEffect, useRef } from 'react'

import { Layers } from '../../../domain/entities/layers'
import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from './styles/administrativeAndRegulatoryLayers.style'

import type { Feature } from 'ol'
import type OpenLayerMap from 'ol/Map'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryLayers({ map }: { map: OpenLayerMap }) {
  const { regulatoryLayers, showedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId } = useAppSelector(state => state.regulatoryMetadata)

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
      if (regulatoryLayers.length > 0) {
        const features = regulatoryLayers.reduce((feats: Feature[], regulatorylayer) => {
          if (showedRegulatoryLayerIds.includes(regulatorylayer.id) && regulatorylayer?.geometry) {
            const feature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(regulatorylayer.geometry)
            feature.setId(`${Layers.REGULATORY_ENV.code}:${regulatorylayer.id}`)
            const geometry = feature.getGeometry()
            const area = geometry && getArea(geometry)
            feature.setProperties({ area, layerId: regulatorylayer.id, ...regulatorylayer.properties })

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
        features.forEach(f => f.set(metadataIsShowedPropertyName, f.get('layerId') === regulatoryMetadataLayerId))
      }
    }
  }, [map, regulatoryMetadataLayerId])

  return null
}
