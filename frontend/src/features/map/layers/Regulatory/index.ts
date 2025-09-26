import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import { displayTags } from '@utils/getTagsAsOptions'
import VectorLayer from 'ol/layer/Vector'
import WebGLVectorLayer from 'ol/layer/WebGLVector'
import VectorSource from 'ol/source/Vector'
import { Fill, Style } from 'ol/style'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getRegulatoryFeatureFromLayer } from './regulatoryGeometryHelpers'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryEnvColorWithAlpha, regulatoryStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName, WebGLVectorLayerWithName } from 'domain/types/layer'
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
    new WebGLVectorLayer({
      source: regulatoryVectorSourceRef.current,
      style: regulatoryStyle
    })
  ) as MutableRefObject<WebGLVectorLayerWithName>
  regulatoryVectorLayerRef.current.name = `${Layers.REGULATORY_ENV.code}-2`

  const pickingStyle = new Style({
    fill: new Fill({ color: 'transparent' })
  })

  const pickingLayer = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryVectorSourceRef.current,
      style: pickingStyle
    })
  ) as MutableRefObject<VectorLayerWithName>
  pickingLayer.current.name = Layers.REGULATORY_ENV.code

  const regulatoryLayersFeatures = useMemo(() => {
    let regulatoryFeatures: Feature[] = []

    if (regulatoryLayers?.entities) {
      regulatoryFeatures = showedRegulatoryLayerIds.reduce((feats: Feature[], regulatorylayerId) => {
        const regulatorylayer = regulatoryLayers.entities[regulatorylayerId]
        if (regulatorylayer) {
          const feature = getRegulatoryFeatureFromLayer({
            code: Layers.REGULATORY_ENV.code,
            color: getRegulatoryEnvColorWithAlpha(displayTags(regulatorylayer.tags), regulatorylayer.entityName),
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
      map.getLayers().push(pickingLayer.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(regulatoryVectorLayerRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(pickingLayer.current)
      }
    }
  }, [map])

  useEffect(() => {
    regulatoryVectorLayerRef.current?.setVisible(isLayerVisible)
    pickingLayer.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
