import { useGetRegulatoryAreaByIdQuery } from '@api/regulatoryAreasAPI'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router'

import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function BackofficeRegulatoryAreaLayer({ map }: BaseMapChildrenProps) {
  const { regulatoryAreaId } = useParams()

  const openedRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaTable.openedRegulatoryAreaId)
  const newRegulatoryAreaId = useAppSelector(state => state.regulatoryAreaBo.newRegulatoryAreaId)

  const layerId = useMemo(
    () => regulatoryAreaId ?? openedRegulatoryAreaId ?? newRegulatoryAreaId ?? undefined,
    [regulatoryAreaId, openedRegulatoryAreaId, newRegulatoryAreaId]
  )

  const { data: regulatoryArea } = useGetRegulatoryAreaByIdQuery(Number(layerId), {
    skip: !layerId
  })

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
  const regulatoryFeature = useMemo(() => {
    if (!layerId || !regulatoryArea) {
      return undefined
    }

    return getRegulatoryFeature({
      code: Layers.REGULATORY_ENV.code,
      isolatedLayer: undefined,
      layer: {
        ...regulatoryArea,
        metadataIsShowed: true
      }
    })
  }, [layerId, regulatoryArea])

  useEffect(() => {
    regulatoryVectorSourceRef.current?.clear(true)
    if (regulatoryFeature) {
      regulatoryVectorSourceRef.current?.addFeatures([regulatoryFeature])
    }
  }, [regulatoryFeature])

  useEffect(() => {
    regulatoryVectorLayerRef.current?.setVisible(!!layerId)
  }, [layerId])

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

  return null
}
