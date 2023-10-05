import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { reportingToAttachStyle } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function HoveredReportingToAttachLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
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
          style: reportingToAttachStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.REPORTING_TO_ATTACH_ON_MISSION.zIndex
        }) as VectorLayerWithName
        vectorLayerRef.current.name = Layers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION.code
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
    if (
      currentFeatureOver &&
      currentFeatureOver.getId()?.toString()?.includes(Layers.REPORTING_TO_ATTACH_ON_MISSION.code)
    ) {
      GetVectorSource()?.addFeature(currentFeatureOver)
    }
  }, [currentFeatureOver])

  return null
}
