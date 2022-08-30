import React from 'react'
import { useSelector } from 'react-redux'

import { MissionCard } from './MissionCard'
import Layers from '../../../../domain/entities/layers'
import { OverlayPositionOnExtent } from '../OverlayPositionOnExtent'


export const MissionOverlays = ({map, currentFeatureOver}) => {
  const { selectedMissionId } = useSelector(state => state.missionState)
  const { displayMissionsOverlay } = useSelector(state => state.global)
  const feature = map.getLayers().getArray().find(l=>l.name === Layers.MISSIONS.code)?.getSource().getFeatureById(`${Layers.MISSIONS.code}:${selectedMissionId}`)
  const displayHoveredFeature = currentFeatureOver?.getId()?.startsWith(Layers.MISSIONS.code) && currentFeatureOver?.getId() !== `${Layers.MISSIONS.code}:${selectedMissionId}`
  return (
    <>
      <OverlayPositionOnExtent
        feature={displayMissionsOverlay && feature} 
        map={map} 
        appClassName={'overlay-mission-selected'}
        >
        <MissionCard feature={feature} selected />
      </OverlayPositionOnExtent>
      <OverlayPositionOnExtent 
        feature={displayMissionsOverlay && displayHoveredFeature && currentFeatureOver} 
        map={map}  
        appClassName={'overlay-mission-hover'}
        >
        <MissionCard feature={currentFeatureOver} />
      </OverlayPositionOnExtent>
    </>
    )
} 
