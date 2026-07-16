import { useGetRegulatoryAreaGroupByIdQuery } from '@api/regulatoryAreasAPI'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { skipToken } from '@reduxjs/toolkit/query'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router'

import { Layers } from '../../../../domain/entities/layers/constants'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function BackofficeRegulatoryAreaGroupLayer({ map }: BaseMapChildrenProps) {
  const { groupId } = useParams()
  const { data: regulatoryAreaGroup } = useGetRegulatoryAreaGroupByIdQuery(
    groupId && !Number.isNaN(+groupId) ? +groupId : skipToken
  )
  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)

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

  const regulatoryFeatures = useMemo(() => {
    if (!regulatoryAreaGroup) {
      return []
    }

    return regulatoryAreaGroup.regulatoryAreas
      .map(regulatoryArea =>
        getRegulatoryFeature({
          code: Layers.REGULATORY_ENV.code,
          isolatedLayer: undefined,
          layer: {
            ...regulatoryArea,
            metadataIsShowed: openedRegulatoryAreaId === regulatoryArea.id
          }
        })
      )
      .filter(feature => feature !== undefined)
  }, [openedRegulatoryAreaId, regulatoryAreaGroup])

  useEffect(() => {
    regulatoryVectorSourceRef.current?.clear(true)
    if (regulatoryFeatures.length > 0) {
      regulatoryVectorSourceRef.current?.addFeatures(regulatoryFeatures)
    }
  }, [regulatoryFeatures])

  useEffect(() => {
    if (map) {
      map.getLayers().push(regulatoryVectorLayerRef.current)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(regulatoryVectorLayerRef.current)
      }
    }

    return () => {}
  }, [map])

  return null
}
