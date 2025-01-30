import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { MissionCard } from '@features/Mission/components/Overlays/MissionCard'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { convertToFeature } from 'domain/types/map'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

const OPTIONS = {
  margins: {
    xLeft: 20,
    xMiddle: 120,
    xRight: 20,
    yBottom: 20,
    yMiddle: 20,
    yTop: 20
  }
}

export function MissionToAttachOverlays({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const displayMissionToAttachLayer = useAppSelector(state => state.global.layers.displayMissionToAttachLayer)
  const feature = convertToFeature(currentFeatureOver)
  const currentfeatureId = feature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-mission-to-attach-hover"
      feature={displayMissionToAttachLayer && displayHoveredFeature ? feature : undefined}
      map={map}
      mapClickEvent={mapClickEvent}
      options={OPTIONS}
      zIndex={6000}
    >
      <MissionCard feature={feature} isOnlyHoverable />
    </OverlayPositionOnCentroid>
  )
}
