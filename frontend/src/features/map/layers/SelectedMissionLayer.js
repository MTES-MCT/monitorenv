import {  useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'


import { useGetMissionsQuery } from '../../../api/missionsAPI'
import Layers from '../../../domain/entities/layers'
import { selectedMissionStyle, selectedMissionActionsStyle } from './styles/missions.style'
import { getMissionZoneFeature, getActionsFeatures } from './missionGeometryHelpers'


export const SelectedMissionLayer = ({ map }) => {
  const { selectedMissionId } = useSelector(state => state.missionState)
  const { displaySelectedMissionLayer } = useSelector(state => state.global)
  const { selectedMission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) =>  ({
      selectedMission: data?.find(op => op.id === selectedMissionId),
    }),
  })
  
  const selectedMissionEditedState = useSelector(state => state.missionState.missionState)

  const displayedMission = selectedMissionEditedState || selectedMission

  const selectedMissionVectorSourceRef = useRef(null)
  const GetSelectedMissionVectorSource = () => {
    if (selectedMissionVectorSourceRef.current === null) {
      selectedMissionVectorSourceRef.current = new VectorSource()
       
    }
    return selectedMissionVectorSourceRef.current
  }

  const selectedMissionActionsVectorSourceRef = useRef(null)
  const GetSelectedMissionActionsVectorSource = () => {
    if (selectedMissionActionsVectorSourceRef.current === null) {
      selectedMissionActionsVectorSourceRef.current = new VectorSource()
       
    }
    return selectedMissionActionsVectorSourceRef.current
  }

  const selectedMissionVectorLayerRef = useRef(null)
  const selectedMissionActionsVectorLayerRef = useRef(null)
  

  const GetSelectedMissionVectorLayer = () => {
    if (selectedMissionVectorLayerRef.current === null) {
      selectedMissionVectorLayerRef.current = new VectorLayer({
        source: GetSelectedMissionVectorSource(),
        style: selectedMissionStyle,
        renderBuffer: 7,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.MISSION_SELECTED.zIndex,
      })
      selectedMissionVectorLayerRef.current.name = Layers.MISSION_SELECTED.code
    }
    return selectedMissionVectorLayerRef.current
  }
  const GetSelectedMissionActionsVectorLayer = () => {
    if (selectedMissionActionsVectorLayerRef.current === null) {
      selectedMissionActionsVectorLayerRef.current = new VectorLayer({
        source: GetSelectedMissionActionsVectorSource(),
        style: selectedMissionActionsStyle,
        renderBuffer: 7,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.ACTIONS.zIndex,
      })
      selectedMissionActionsVectorLayerRef.current.name = Layers.ACTIONS.code
    }
    return selectedMissionActionsVectorLayerRef.current
  }
  
  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(GetSelectedMissionVectorLayer())
      layersCollection.push(GetSelectedMissionActionsVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(GetSelectedMissionVectorLayer())}
        map.removeLayer(GetSelectedMissionActionsVectorLayer())
      }
  }, [map])

  useEffect(() => {
    GetSelectedMissionVectorLayer()?.setVisible(displaySelectedMissionLayer)
    GetSelectedMissionActionsVectorLayer()?.setVisible(displaySelectedMissionLayer)
  }, [displaySelectedMissionLayer])

  useEffect(() => {
    GetSelectedMissionVectorSource()?.clear(true)
    GetSelectedMissionActionsVectorSource()?.clear(true)
    if (displayedMission) {
      GetSelectedMissionVectorSource()?.addFeature(getMissionZoneFeature(displayedMission, Layers.MISSION_SELECTED.code))
      GetSelectedMissionActionsVectorSource()?.addFeatures(getActionsFeatures(displayedMission))
    }
  }, [displayedMission])

  return null
}
