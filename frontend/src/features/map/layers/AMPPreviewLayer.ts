import { Feature } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { MutableRefObject, useEffect, useRef } from 'react'

import { getAMPLayerStyle } from './styles/AMPLayers.style'
import { dottedLayerStyle } from './styles/dottedLayer.style'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { Layers } from '../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { MapChildrenProps } from '../Map'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPPreviewLayer({ map }: MapChildrenProps) {
  const { ampsSearchResult, isAmpSearchResultsVisible, searchExtent } = useAppSelector(state => state.layerSearch)
  const { data: ampLayers } = useGetAMPsQuery()
  const { layersSidebarIsOpen } = useAppSelector(state => state.global)

  const ampLayerRef = useRef() as MutableRefObject<Vector<VectorSource>>
  const ampVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const isThrottled = useRef(false)

  function getAMPVectorSource() {
    if (!ampVectorSourceRef.current) {
      ampVectorSourceRef.current = new VectorSource({
        features: []
      })
    }

    return ampVectorSourceRef.current
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
    function refreshPreviewLayer() {
      getAMPVectorSource().clear()
      if (ampsSearchResult && ampLayers?.entities) {
        const features = ampsSearchResult.reduce((amplayers, id) => {
          const layer = ampLayers.entities[id]

          if (layer && layer.geom) {
            const feature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(layer.geom)
            const geometry = feature.getGeometry()
            const area = geometry && getArea(geometry)
            feature.setId(`${Layers.REGULATORY_ENV_PREVIEW.code}:${layer.id}`)

            feature.setProperties({
              area,
              layerId: layer.id,
              ...layer
            })

            amplayers.push(feature)
          }

          return amplayers
        }, [] as Feature[])
        getAMPVectorSource().addFeatures(features)
      }
    }

    if (map) {
      if (isThrottled.current) {
        return
      }

      isThrottled.current = true

      setTimeout(() => {
        isThrottled.current = false
        refreshPreviewLayer()
      }, 3000)
    }
  }, [map, ampsSearchResult, ampLayers])

  useEffect(() => {
    function getLayer() {
      if (!ampLayerRef.current) {
        ampLayerRef.current = new Vector({
          properties: {
            name: Layers.AMP.code
          },
          renderBuffer: 4,
          renderOrder: (a, b) => b.get('area') - a.get('area'),
          source: getAMPVectorSource(),
          style: getAMPLayerStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        })
      }

      return ampLayerRef.current
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
      if (layersSidebarIsOpen && isAmpSearchResultsVisible) {
        searchExtentLayerRef.current?.setVisible(true)
        ampLayerRef.current?.setVisible(true)
      } else {
        searchExtentLayerRef.current?.setVisible(false)
        ampLayerRef.current?.setVisible(false)
      }
    }
  }, [map, layersSidebarIsOpen, isAmpSearchResultsVisible])

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
