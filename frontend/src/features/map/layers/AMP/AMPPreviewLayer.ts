import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import { Feature } from 'ol'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { getAMPFeature } from './AMPGeometryHelpers'
import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { dottedLayerStyle } from '../styles/dottedLayer.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPPreviewLayer({ map }: BaseMapChildrenProps) {
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))
  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const isAmpSearchResultsVisible = useAppSelector(state => state.layerSearch.isAmpSearchResultsVisible)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))

  const { data: ampLayers } = useGetAMPsQuery()
  const { isLayersSidebarVisible } = useAppSelector(state => state.global)

  const isLayerVisible = isLayersSidebarVisible && isAmpSearchResultsVisible && !isLinkingRegulatoryToVigilanceArea

  const ampLayerRef = useRef() as MutableRefObject<VectorLayerWithName>
  const ampVectorSourceRef = useRef(new VectorSource())
  const isThrottled = useRef(false)

  const searchExtentLayerRef = useRef() as MutableRefObject<Vector<VectorSource>>
  const seachExtentVectorSourceRef = useRef(new VectorSource())
  useEffect(() => {
    if (map) {
      const features = ampVectorSourceRef.current.getFeatures()
      if (features?.length) {
        features.forEach(f => f.set(metadataIsShowedPropertyName, f.get('id') === ampMetadataLayerId))
      }
    }
  }, [map, ampMetadataLayerId])

  useEffect(() => {
    function refreshPreviewLayer() {
      ampVectorSourceRef.current.clear()
      if (ampsSearchResult && ampLayers?.entities) {
        const features = ampsSearchResult.reduce((amplayers, id) => {
          if (showedAmpLayerIds.includes(id)) {
            return amplayers
          }
          const layer = ampLayers.entities[id]

          if (layer && layer.geom) {
            const feature = getAMPFeature({ code: Layers.AMP_PREVIEW.code, layer })

            amplayers.push(feature)
          }

          return amplayers
        }, [] as Feature[])
        ampVectorSourceRef.current.addFeatures(features)
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
  }, [map, ampsSearchResult, ampLayers, showedAmpLayerIds])

  useEffect(() => {
    function getLayer() {
      if (!ampLayerRef.current) {
        ampLayerRef.current = new Vector({
          properties: {
            name: Layers.AMP.code
          },
          renderBuffer: 4,
          renderOrder: (a, b) => b.get('area') - a.get('area'),
          source: ampVectorSourceRef.current,
          style: getAMPLayerStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true
        })
        ampLayerRef.current.name = Layers.AMP.code
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
    searchExtentLayerRef.current?.setVisible(isLayerVisible)
    ampLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

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
    function getLayer() {
      if (!searchExtentLayerRef.current) {
        searchExtentLayerRef.current = new Vector({
          source: seachExtentVectorSourceRef.current,
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
