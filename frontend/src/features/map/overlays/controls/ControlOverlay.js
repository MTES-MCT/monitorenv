import React from 'react'

import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'
import { ControlCard } from './ControlCard'

import Layers from '../../../../domain/entities/layers'

export const ControlOverlay = ({ map, currentFeatureOver }) => {
  const displayHoveredFeature = currentFeatureOver?.getId()?.startsWith(Layers.ACTIONS.code)
  return (
      <OverlayPositionOnCentroid feature={displayHoveredFeature && currentFeatureOver} map={map} >
        <ControlCard feature={currentFeatureOver} />
      </OverlayPositionOnCentroid>
    )

  
}
