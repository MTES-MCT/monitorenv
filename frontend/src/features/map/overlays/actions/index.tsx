import { Mission } from '@features/Mission/mission.type'
import { convertToFeature } from 'domain/types/map'

import { ControlCard } from './ControlCard'
import { SurveillanceCard } from './SurveillanceCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../BaseMap'

export function ActionOverlay({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(`${Layers.ACTIONS.code}`)
  const displayControlCard =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(`${Layers.ACTIONS.code}:${Mission.ActionTypeEnum.CONTROL}`)
  const displaySurveillanceCard =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(`${Layers.ACTIONS.code}:${Mission.ActionTypeEnum.SURVEILLANCE}`)

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-action-hover"
      feature={displayHoveredFeature ? hoveredFeature : undefined}
      map={map}
      zIndex={5500}
    >
      {displayControlCard && <ControlCard feature={hoveredFeature} />}
      {displaySurveillanceCard && <SurveillanceCard feature={hoveredFeature} />}
    </OverlayPositionOnCentroid>
  )
}
