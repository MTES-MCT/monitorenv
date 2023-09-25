import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { hoveredReportingStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

export function HoveredReportingLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const vectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetVectorSource = () => {
    if (vectorSourceRef.current === undefined) {
      vectorSourceRef.current = new VectorSource()
    }

    return vectorSourceRef.current
  }

  const vectorLayerRef = useRef() as MutableRefObject<VectorLayerWithName>

  useEffect(() => {
    const GetVectorLayer = () => {
      if (vectorLayerRef.current === undefined) {
        vectorLayerRef.current = new VectorLayer({
          renderBuffer: 7,
          source: GetVectorSource(),
          style: hoveredReportingStyleFn,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.REPORTINGS.zIndex
        }) as VectorLayerWithName
        vectorLayerRef.current.name = Layers.REPORTING_SELECTED.code
      }

      return vectorLayerRef.current
    }

    if (map) {
      map.getLayers().push(GetVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(GetVectorLayer())
      }
    }
  }, [map])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (currentFeatureOver) {
      GetVectorSource()?.addFeature(currentFeatureOver)
    }
  }, [currentFeatureOver])

  return null
}
