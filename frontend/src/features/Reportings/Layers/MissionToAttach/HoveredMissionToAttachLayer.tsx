import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'
import { missionZoneStyle } from '../../../map/layers/Missions/missions.style'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function HoveredMissionToAttachLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const vectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource>

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: missionZoneStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.MISSION_TO_ATTACH_ON_REPORTING.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.SELECTED_MISSION_TO_ATTACH_ON_REPORTING.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)

    if (
      currentFeatureOver &&
      currentFeatureOver.getId()?.toString()?.includes(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)
    ) {
      vectorSourceRef.current?.addFeature(currentFeatureOver)
    }
  }, [currentFeatureOver])

  return null
}
