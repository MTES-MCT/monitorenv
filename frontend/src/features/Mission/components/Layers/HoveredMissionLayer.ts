import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { missionZoneStyle } from './missions.style'
import { Layers } from '../../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function HoveredMissionLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const hoveredMissionVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const hoveredMissionVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: hoveredMissionVectorSourceRef.current,
      style: missionZoneStyle,
      zIndex: Layers.HOVERED_MISSION.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  hoveredMissionVectorLayerRef.current.name = Layers.HOVERED_MISSION.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(hoveredMissionVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(hoveredMissionVectorLayerRef.current)
      }
    }
  }, [map])

  useEffect(() => {
    hoveredMissionVectorSourceRef.current?.clear(true)
    const feature = convertToFeature(currentFeatureOver)
    if (feature?.getId()?.toString()?.includes(Layers.MISSIONS.code)) {
      hoveredMissionVectorSourceRef.current?.addFeature(feature)
    }
  }, [currentFeatureOver])

  return null
}
