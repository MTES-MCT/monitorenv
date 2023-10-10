import { useState } from 'react'

import { ReportingCard } from './ReportingCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

const MARGINS = {
  xLeft: 50,
  xMiddle: 30,
  xRight: -55,
  yBottom: 50,
  yMiddle: 50,
  yTop: -55
}

export function ReportingToAttachOverlays({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const { displayReportingToAttachLayer } = useAppSelector(state => state.global)

  const [hoveredMargins, setHoveredMargins] = useState(MARGINS)

  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Layers.REPORTING_TO_ATTACH_ON_MISSION.code)

  const updateHoveredMargins = (cardHeight: number) => {
    if (MARGINS.yTop - cardHeight !== hoveredMargins.yTop) {
      setHoveredMargins({ ...hoveredMargins, yTop: MARGINS.yTop - cardHeight })
    }
  }

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-reporting-to-attach-hover"
      feature={displayReportingToAttachLayer && displayHoveredFeature && currentFeatureOver}
      map={map}
      options={{ margins: hoveredMargins }}
    >
      <ReportingCard feature={currentFeatureOver} updateMargins={updateHoveredMargins} />
    </OverlayPositionOnCentroid>
  )
}
