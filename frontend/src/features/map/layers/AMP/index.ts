import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { getAMPFeature } from './AMPGeometryHelpers'
import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPLayers({ map }: BaseMapChildrenProps) {
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const showedAmpMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))

  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLayerVisible = !isLinkingRegulatoryToVigilanceArea

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
    layerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear()
      if (ampLayers?.entities) {
        const features = showedAmpLayerIds.reduce((feats: Feature[], layerId) => {
          const ampLayer = ampLayers.entities[layerId]
          if (ampLayer) {
            const feature = getAMPFeature({ code: Layers.AMP_PREVIEW.code, layer: ampLayer })

            feats.push(feature)
          }

          return feats
        }, [])

        vectorSourceRef.current.addFeatures(features)
      }
    }
  }, [map, ampLayers, showedAmpLayerIds])

  useEffect(() => {
    if (map) {
      const features = vectorSourceRef.current.getFeatures()
      if (features?.length) {
        features.forEach(f => {
          f.set(metadataIsShowedPropertyName, f.get('id') === showedAmpMetadataLayerId)
        })
      }
    }
  }, [map, showedAmpMetadataLayerId])

  return null
}
