import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import { Feature } from 'ol'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { getRegulatoryFeature } from './regulatoryGeometryHelpers'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'
import { dottedLayerStyle } from '../styles/dottedLayer.style'

import type { BaseMapChildrenProps } from '../../BaseMap'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const isLayersSidebarVisible = useAppSelector(state => state.global.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea

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
        features.forEach(f => f.set(metadataIsShowedPropertyName, f.get('id') === regulatoryMetadataLayerId))
      }
    }
  }, [map, regulatoryMetadataLayerId])

  useEffect(() => {
    function refreshPreviewLayer() {
      getRegulatoryVectorSource().clear()
      if (regulatoryLayersSearchResult) {
        const features = regulatoryLayersSearchResult.reduce((regulatorylayers, id) => {
          const layer = regulatoryLayers?.entities[id]

          if (layer && layer.geom) {
            const feature = getRegulatoryFeature({ code: Layers.REGULATORY_ENV_PREVIEW.code, layer })

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
  }, [map, regulatoryLayersSearchResult, regulatoryLayers])

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
      searchExtentLayerRef.current?.setVisible(isLayerVisible)
      regulatoryLayerRef.current?.setVisible(isLayerVisible)
    }
  }, [map, isLayerVisible])

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
