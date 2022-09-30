import React from 'react'
import { useSelector } from 'react-redux'

import { Layers } from '../../../../domain/entities/layers'
import { OverlayPositionOnExtent } from '../OverlayPositionOnExtent'
import { MissionCard } from './MissionCard'

export function MissionOverlays({ currentFeatureOver, map }) {
  const { selectedMissionId } = useSelector(state => state.missionState)
  const { displayMissionsOverlay } = useSelector(state => state.global)
  const feature = map
    .getLayers()
    .getArray()
    .find(l => l.name === Layers.MISSIONS.code)
    ?.getSource()
    .getFeatureById(`${Layers.MISSIONS.code}:${selectedMissionId}`)
  const displayHoveredFeature =
    currentFeatureOver?.getId()?.startsWith(Layers.MISSIONS.code) &&
    currentFeatureOver?.getId() !== `${Layers.MISSIONS.code}:${selectedMissionId}`

  return (
    <>
      <OverlayPositionOnExtent
        appClassName="overlay-mission-selected"
        feature={displayMissionsOverlay && feature}
        map={map}
      >
        <MissionCard feature={feature} selected />
      </OverlayPositionOnExtent>
      <OverlayPositionOnExtent
        appClassName="overlay-mission-hover"
        feature={displayMissionsOverlay && displayHoveredFeature && currentFeatureOver}
        map={map}
      >
        <MissionCard feature={currentFeatureOver} />
      </OverlayPositionOnExtent>
    </>
  )
}
