import React from 'react'
import { useSelector } from 'react-redux'
import Layers from '../../../../domain/entities/layers'
import { MissionCardOverlay } from './MissionCardOverlay'


export const MissionOverlays = ({map, currentFeatureOver}) => {
  const {selectedMissionId} = useSelector(state => state.missionState)
  const feature = map.getLayers().getArray().find(l=>l.name === Layers.MISSIONS.code)?.getSource().getFeatureById(`${Layers.MISSIONS.code}:${selectedMissionId}`)
  const displayHoveredFeature = currentFeatureOver?.getId()?.startsWith(Layers.MISSIONS.code) && currentFeatureOver?.getId() !== `${Layers.MISSIONS.code}:${selectedMissionId}`
  return (
    <>
      <MissionCardOverlay feature={feature} map={map} selected/>
      <MissionCardOverlay feature={displayHoveredFeature && currentFeatureOver} map={map} />
    </>
    )
} 