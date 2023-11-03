import { MissionCard } from './MissionCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnExtent } from '../../../map/overlays/OverlayPositionOnExtent'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function MissionToAttachOverlays({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const attachedMissionId = useAppSelector(state => state.attachReportingToMission.attachedMissionId)

  const { displayMissionToAttachLayer } = useAppSelector(state => state.global)
  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') &&
        (l as VectorLayerWithName).name === Layers.MISSION_TO_ATTACH_ON_REPORTING.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.MISSION_TO_ATTACH_ON_REPORTING.code}:${attachedMissionId}`)
  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.MISSION_TO_ATTACH_ON_REPORTING.code) &&
    currentfeatureId !== `${Layers.MISSION_TO_ATTACH_ON_REPORTING.code}:${attachedMissionId}`

  return (
    <>
      <OverlayPositionOnExtent
        appClassName="overlay-mission-to-attach-selected"
        feature={displayMissionToAttachLayer && feature}
        map={map}
      >
        <MissionCard feature={feature} />
      </OverlayPositionOnExtent>
      <OverlayPositionOnExtent
        appClassName="overlay-mission-to-attach-hover"
        feature={displayMissionToAttachLayer && displayHoveredFeature && currentFeatureOver}
        map={map}
      >
        <MissionCard feature={currentFeatureOver} />
      </OverlayPositionOnExtent>
    </>
  )
}
