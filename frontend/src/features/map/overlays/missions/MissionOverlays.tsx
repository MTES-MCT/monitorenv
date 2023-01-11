import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnExtent } from '../OverlayPositionOnExtent'
import { MissionCard } from './MissionCard'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { MapChildrenProps } from '../../Map'

export function MissionOverlays({ currentFeatureOver, map }: MapChildrenProps) {
  const { selectedMissionId } = useAppSelector(state => state.missionState)
  const { displayMissionsOverlay } = useAppSelector(state => state.global)
  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.MISSIONS.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.MISSIONS.code}:${selectedMissionId}`)
  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.MISSIONS.code) &&
    currentfeatureId !== `${Layers.MISSIONS.code}:${selectedMissionId}`

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
