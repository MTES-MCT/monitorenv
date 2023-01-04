import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { Layers } from '../../../domain/entities/layers/constants'
import { missionZoneStyle } from './styles/missions.style'

export function HoveredMissionLayer({ currentFeatureOver, map }) {
  const vectorSourceRef = useRef(null)
  const GetVectorSource = () => {
    if (vectorSourceRef.current === null) {
      vectorSourceRef.current = new VectorSource()
    }

    return vectorSourceRef.current
  }

  const vectorLayerRef = useRef(null)

  useEffect(() => {
    const GetVectorLayer = () => {
      if (vectorLayerRef.current === null) {
        vectorLayerRef.current = new VectorLayer({
          renderBuffer: 7,
          source: GetVectorSource(),
          style: missionZoneStyle,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.MISSIONS.zIndex
        })
        vectorLayerRef.current.name = Layers.MISSION_SELECTED.code
      }

      return vectorLayerRef.current
    }

    map && map.getLayers().push(GetVectorLayer())

    return () => map && map.removeLayer(GetVectorLayer())
  }, [map])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (currentFeatureOver) {
      GetVectorSource()?.addFeature(currentFeatureOver)
    }
  }, [currentFeatureOver])

  return null
}
