import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getRegulatoryFeature } from './regulatoryGeometryHelpers'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryLayers({ map }: BaseMapChildrenProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLayerVisible = !isLinkingAMPToVigilanceArea

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const regulatoryVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const regulatoryVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryVectorSourceRef.current,
      style: getRegulatoryLayerStyle
    })
  ) as MutableRefObject<VectorLayerWithName>
  regulatoryVectorLayerRef.current.name = Layers.REGULATORY_ENV.code

  const regulatoryLayersFeatures = useMemo(() => {
    let regulatoryFeatures: Feature[] = []

    if (regulatoryLayers?.entities) {
      regulatoryFeatures = showedRegulatoryLayerIds.reduce((feats: Feature[], regulatorylayerId) => {
        const regulatorylayer = regulatoryLayers.entities[regulatorylayerId]
        if (regulatorylayer) {
          const feature = getRegulatoryFeature({
            code: Layers.REGULATORY_ENV.code,
            isolatedLayer,
            layer: regulatorylayer
          })
          if (feature) {
            const metadataIsShowed = regulatorylayer.id === regulatoryMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)
            feats.push(feature)
          }
        }

        return feats
      }, [])
    }

    return regulatoryFeatures
  }, [regulatoryLayers?.entities, showedRegulatoryLayerIds, regulatoryMetadataLayerId, isolatedLayer])

  useEffect(() => {
    regulatoryVectorSourceRef.current?.clear(true)
    if (regulatoryLayersFeatures) {
      regulatoryVectorSourceRef.current?.addFeatures(regulatoryLayersFeatures)
    }
  }, [regulatoryLayersFeatures])

  useEffect(() => {
    if (map) {
      map.getLayers().push(regulatoryVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(regulatoryVectorLayerRef.current)
      }
    }
  }, [map])

  useEffect(() => {
    regulatoryVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
