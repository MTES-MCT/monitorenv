import { useState } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'
import { ReportingCard } from '../../../map/overlays/reportings/ReportingCard'

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
  const displayReportingToAttachLayer = useAppSelector(state => state.global.displayReportingToAttachLayer)

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
      feature={displayReportingToAttachLayer && displayHoveredFeature ? currentFeatureOver : undefined}
      map={map}
      options={{ margins: hoveredMargins }}
      zIndex={5000}
    >
      <ReportingCard feature={currentFeatureOver} isOnlyHoverable updateMargins={updateHoveredMargins} />
    </OverlayPositionOnCentroid>
  )
}
