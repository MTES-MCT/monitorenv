import {  useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'


import { useGetMissionsQuery } from '../../../api/missionsAPI'
import Layers from '../../../domain/entities/layers'
import { selectedMissionStyleFn } from './styles/missions.style'
import { getMissionZoneFeature, getActionsFeatures } from './missionGeometryHelpers'


export const SelectedMissionLayer = ({ map }) => {
  const { selectedMissionId } = useSelector(state => state.missionState)
  const { mission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      mission: data?.find(op => op.id === selectedMissionId),
    }),
  })
  
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
          style: selectedMissionStyleFn,
          renderBuffer: 7,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.MISSION_SELECTED.zIndex,
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
    if (mission) {
      GetVectorSource()?.addFeature(getMissionZoneFeature(mission, Layers.MISSION_SELECTED.code))
      GetVectorSource()?.addFeatures(getActionsFeatures(mission, Layers.MISSION_SELECTED.code))
    }
  }, [mission])

  return null
}
