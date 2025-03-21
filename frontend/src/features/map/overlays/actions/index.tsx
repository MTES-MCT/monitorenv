import { convertToFeature } from 'domain/types/map'

import { MissionControlCard } from './MissionControlCard'
import { SurveillanceCard } from './SurveillanceCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { ActionTypeEnum } from '../../../../domain/entities/missions'
import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../BaseMap'

export function ActionOverlay({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(`${Layers.ACTIONS.code}`)
  const displayControlCard =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(`${Layers.ACTIONS.code}:${ActionTypeEnum.CONTROL}`)
  const displaySurveillanceCard =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(`${Layers.ACTIONS.code}:${ActionTypeEnum.SURVEILLANCE}`)

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-action-hover"
      feature={displayHoveredFeature ? hoveredFeature : undefined}
      map={map}
      mapClickEvent={mapClickEvent}
      zIndex={5500}
    >
      {displayControlCard && hoveredFeature && <MissionControlCard feature={hoveredFeature} />}
      {displaySurveillanceCard && <SurveillanceCard feature={hoveredFeature} />}
    </OverlayPositionOnCentroid>
  )
}
