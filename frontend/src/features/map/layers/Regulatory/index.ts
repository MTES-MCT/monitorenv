import { useGetRegulatoryAreasByIdsQuery } from '@api/regulatoryAreasAPI'
import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getRegulatoryFeature } from './regulatoryGeometryHelpers'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { Axis } from '../../../../types'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryLayers({ map }: BaseMapChildrenProps) {
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))

  const { data: regulatoryLayers } = useGetRegulatoryAreasByIdsQuery({
    axis: Axis.NORTH_SOUTH,
    ids: showedRegulatoryLayerIds
  })

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLayerVisible = !isLinkingAMPToVigilanceArea

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const regulatoryVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const regulatoryVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryVectorSourceRef.current,
      style: feature => getRegulatoryLayerStyle(feature)
    })
  ) as MutableRefObject<VectorLayerWithName>
  regulatoryVectorLayerRef.current.name = Layers.REGULATORY_ENV.code

  const regulatoryAreasFeatures = useMemo(() => {
    if (!regulatoryLayers || regulatoryLayers.length === 0) {
      return []
    }

    return regulatoryLayers.reduce<Feature<Geometry>[]>((acc, regulatoryArea) => {
      if (regulatoryArea) {
        const feature = getRegulatoryFeature({
          code: Layers.REGULATORY_ENV.code,
          isolatedLayer,
          layer: regulatoryArea
        })
        if (feature) {
          const metadataIsShowed = regulatoryArea.id === regulatoryMetadataLayerId
          feature.set(metadataIsShowedPropertyName, metadataIsShowed)
          acc.push(feature)
        }
      }

      return acc
    }, [])
  }, [isolatedLayer, regulatoryLayers, regulatoryMetadataLayerId])

  useEffect(() => {
    regulatoryVectorSourceRef.current?.clear(true)
    if (regulatoryAreasFeatures) {
      regulatoryVectorSourceRef.current?.addFeatures(regulatoryAreasFeatures)
    }
  }, [regulatoryAreasFeatures])

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
