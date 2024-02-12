import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MissionCard } from '../../../map/overlays/missions/MissionCard'
import { OverlayPositionOnExtent } from '../../../map/overlays/OverlayPositionOnExtent'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function MissionToAttachOverlays({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const displayMissionToAttachLayer = useAppSelector(state => state.global.displayMissionToAttachLayer)

  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)

  return (
    <OverlayPositionOnExtent
      appClassName="overlay-mission-to-attach-hover"
      feature={displayMissionToAttachLayer && displayHoveredFeature && currentFeatureOver}
      map={map}
      zIndex={6000}
    >
      <MissionCard feature={currentFeatureOver} isOnlyHoverable />
    </OverlayPositionOnExtent>
  )
}
