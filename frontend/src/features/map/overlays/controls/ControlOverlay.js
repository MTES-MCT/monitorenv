import React from 'react'

import { Layers } from '../../../../domain/entities/layers'
import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'
import { ControlCard } from './ControlCard'

export function ControlOverlay({ currentFeatureOver, map }) {
  const displayHoveredFeature = currentFeatureOver?.getId()?.startsWith(Layers.ACTIONS.code)

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-control-hover"
      feature={displayHoveredFeature && currentFeatureOver}
      map={map}
    >
      <ControlCard feature={currentFeatureOver} />
    </OverlayPositionOnCentroid>
  )
}
