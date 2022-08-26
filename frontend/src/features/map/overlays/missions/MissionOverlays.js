import React from 'react'
import { useSelector } from 'react-redux'

import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'
import { MissionCard } from './MissionCard'
import Layers from '../../../../domain/entities/layers'


export const MissionOverlays = ({map, currentFeatureOver}) => {
  const { selectedMissionId } = useSelector(state => state.missionState)
  const { displayMissionsOverlay } = useSelector(state => state.global)
  const feature = map.getLayers().getArray().find(l=>l.name === Layers.MISSIONS.code)?.getSource().getFeatureById(`${Layers.MISSIONS.code}:${selectedMissionId}`)
  const displayHoveredFeature = currentFeatureOver?.getId()?.startsWith(Layers.MISSIONS.code) && currentFeatureOver?.getId() !== `${Layers.MISSIONS.code}:${selectedMissionId}`
  return (
    <>
      <OverlayPositionOnCentroid feature={displayMissionsOverlay && feature} map={map}>
        <MissionCard feature={feature} selected />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid feature={displayMissionsOverlay && displayHoveredFeature && currentFeatureOver} map={map} >
        <MissionCard feature={currentFeatureOver} />
      </OverlayPositionOnCentroid>
    </>
    )
} 