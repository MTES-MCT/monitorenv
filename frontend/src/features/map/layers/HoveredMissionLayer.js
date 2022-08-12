import {  useEffect, useRef } from 'react'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'


import Layers from '../../../domain/entities/layers'
import { missionZoneStyle } from './styles/missions.style'


export const HoveredMissionLayer = ({ map, currentFeatureOver }) => {
  
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
          source: GetVectorSource(),
          style: missionZoneStyle,
          renderBuffer: 7,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.MISSIONS.zIndex,
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
