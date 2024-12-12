import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getAMPFeature } from './AMPGeometryHelpers'
import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPLayers({ map }: BaseMapChildrenProps) {
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const showedAmpMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLayerVisible = !isLinkingRegulatoryToVigilanceArea

  const { data: ampLayers } = useGetAMPsQuery()

  const ampVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const ampVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: ampVectorSourceRef.current,
      style: getAMPLayerStyle
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(ampVectorLayerRef.current as VectorLayerWithName).name = Layers.AMP.code

  const ampLayersFeatures = useMemo(() => {
    let ampFeatures: Feature[] = []

    if (ampLayers?.entities) {
      ampFeatures = showedAmpLayerIds.reduce((feats: Feature[], ampLayerId) => {
        const ampLayer = ampLayers.entities[ampLayerId]
        if (ampLayer) {
          const feature = getAMPFeature({ code: Layers.AMP.code, isolatedLayer, layer: ampLayer })
          if (feature) {
            const metadataIsShowed = ampLayer.id === showedAmpMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)

            feats.push(feature)
          }
        }

        return feats
      }, [])
    }

    return ampFeatures
  }, [ampLayers?.entities, isolatedLayer, showedAmpLayerIds, showedAmpMetadataLayerId])

  useEffect(() => {
    ampVectorSourceRef.current?.clear(true)
    if (ampLayersFeatures) {
      ampVectorSourceRef.current?.addFeatures(ampLayersFeatures)
    }
  }, [ampLayersFeatures])

  useEffect(() => {
    if (map) {
      map.getLayers().push(ampVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(ampVectorLayerRef.current)
      }
    }
  }, [map])

  useEffect(() => {
    ampVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
