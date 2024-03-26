import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'

import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MissionCard } from '../../../map/overlays/missions/MissionCard'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

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

export function MissionToAttachOverlays({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const displayMissionToAttachLayer = useAppSelector(state => state.global.displayMissionToAttachLayer)

  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-mission-to-attach-hover"
      feature={displayMissionToAttachLayer && displayHoveredFeature ? currentFeatureOver : undefined}
      map={map}
      options={OPTIONS}
      zIndex={6000}
    >
      <MissionCard feature={currentFeatureOver} isOnlyHoverable />
    </OverlayPositionOnCentroid>
  )
}
