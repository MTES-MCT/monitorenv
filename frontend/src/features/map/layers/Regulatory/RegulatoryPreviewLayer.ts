import { Feature } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'
import { dottedLayerStyle } from '../styles/dottedLayer.style'

import type { BaseMapChildrenProps } from '../../BaseMap'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const { regulatoryMetadataLayerId } = useAppSelector(state => state.regulatoryMetadata)
  const { isRegulatorySearchResultsVisible, regulatoryLayersSearchResult, searchExtent } = useAppSelector(
    state => state.layerSearch
  )
  const { regulatoryLayersById } = useAppSelector(state => state.regulatory)
  const { isLayersSidebarVisible } = useAppSelector(state => state.global)

  const regulatoryLayerRef = useRef() as MutableRefObject<Vector<VectorSource>>
  const regulatoryVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const isThrottled = useRef(false)

  function getRegulatoryVectorSource() {
    if (!regulatoryVectorSourceRef.current) {
      regulatoryVectorSourceRef.current = new VectorSource({
        features: []
      })
    }

    return regulatoryVectorSourceRef.current
  }

  const searchExtentLayerRef = useRef() as MutableRefObject<Vector<VectorSource>>
  const seachExtentVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  function getSearchExtentVectorSource() {
    if (!seachExtentVectorSourceRef.current) {
      seachExtentVectorSourceRef.current = new VectorSource({
        features: []
      })
    }

    return seachExtentVectorSourceRef.current
  }

  useEffect(() => {
    if (map) {
      const features = getRegulatoryVectorSource().getFeatures()
      if (features?.length) {
        features.forEach(f => f.set(metadataIsShowedPropertyName, f.get('layerId') === regulatoryMetadataLayerId))
      }
    }
  }, [map, regulatoryMetadataLayerId])

  useEffect(() => {
    function refreshPreviewLayer() {
      getRegulatoryVectorSource().clear()
      if (regulatoryLayersSearchResult) {
        const features = regulatoryLayersSearchResult.reduce((regulatorylayers, id) => {
          const layer = regulatoryLayersById[id]

          if (layer && layer.geometry) {
            const feature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(layer.geometry)
            const geometry = feature.getGeometry()
            const area = geometry && getArea(geometry)
            feature.setId(`${Layers.REGULATORY_ENV_PREVIEW.code}:${layer.id}`)

            feature.setProperties({
              area,
              layerId: layer.id,
              ...layer.properties
            })

            regulatorylayers.push(feature)
          }

          return regulatorylayers
        }, [] as Feature[])
        getRegulatoryVectorSource().addFeatures(features)
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
  }, [map, regulatoryLayersSearchResult, regulatoryLayersById])

  useEffect(() => {
    function getLayer() {
      if (!regulatoryLayerRef.current) {
        regulatoryLayerRef.current = new Vector({
          properties: {
            name: Layers.REGULATORY_ENV_PREVIEW.code
          },
          renderBuffer: 4,
          renderOrder: (a, b) => b.get('area') - a.get('area'),
          source: getRegulatoryVectorSource(),
          style: getRegulatoryLayerStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        })
      }

      return regulatoryLayerRef.current
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
      if (isLayersSidebarVisible && isRegulatorySearchResultsVisible) {
        searchExtentLayerRef.current?.setVisible(true)
        regulatoryLayerRef.current?.setVisible(true)
      } else {
        searchExtentLayerRef.current?.setVisible(false)
        regulatoryLayerRef.current?.setVisible(false)
      }
    }
  }, [map, isLayersSidebarVisible, isRegulatorySearchResultsVisible])

  useEffect(() => {
    if (map) {
      getSearchExtentVectorSource().clear()
      if (searchExtent) {
        const feature = new Feature(fromExtent(searchExtent))
        getSearchExtentVectorSource().addFeature(feature)
      }
    }
  }, [map, searchExtent])

  useEffect(() => {
    function getLayer() {
      if (!searchExtentLayerRef.current) {
        searchExtentLayerRef.current = new Vector({
          source: getSearchExtentVectorSource(),
          style: dottedLayerStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        })
      }

      return searchExtentLayerRef.current
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

  return null
}
