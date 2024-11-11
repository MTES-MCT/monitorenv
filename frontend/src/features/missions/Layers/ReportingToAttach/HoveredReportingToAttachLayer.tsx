import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'
import { hoveredReportingStyleFn } from '../../../Reportings/components/ReportingLayer/Reporting/style'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function HoveredReportingToAttachLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const vectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource>

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: hoveredReportingStyleFn,
      zIndex: Layers.REPORTING_TO_ATTACH_ON_MISSION.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    const feature = convertToFeature(currentFeatureOver)
    if (feature && feature.getId()?.toString()?.includes(Layers.REPORTING_TO_ATTACH_ON_MISSION.code)) {
      vectorSourceRef.current?.addFeature(feature)
    }
  }, [currentFeatureOver])

  return null
}
