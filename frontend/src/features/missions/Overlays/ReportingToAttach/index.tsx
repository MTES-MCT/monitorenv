import { ReportingCard } from '@features/Reportings/components/ReportingOverlay/Reporting/ReportingCard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { reportingActions } from 'domain/shared_slices/reporting'
import { convertToFeature } from 'domain/types/map'
import { useState } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

const OPTIONS = {
  margins: {
    xLeft: 50,
    xMiddle: 30,
    xRight: -55,
    yBottom: 50,
    yMiddle: 50,
    yTop: -55
  }
}

export function ReportingToAttachOverlays({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const displayReportingToAttachLayer = useAppSelector(state => state.global.displayReportingToAttachLayer)

  const [hoveredOptions, setHoveredOptions] = useState(OPTIONS)

  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Layers.REPORTING_TO_ATTACH_ON_MISSION.code)

  const updateHoveredMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== hoveredOptions.margins.yTop) {
      setHoveredOptions({ margins: { ...hoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

  const close = () => {
    dispatch(reportingActions.setSelectedReportingIdOnMap(undefined))
    dispatch(removeOverlayStroke())
  }

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-reporting-to-attach-hover"
      feature={displayReportingToAttachLayer && displayHoveredFeature ? hoveredFeature : undefined}
      map={map}
      mapClickEvent={mapClickEvent}
      options={hoveredOptions}
      zIndex={5000}
    >
      <ReportingCard feature={hoveredFeature} isOnlyHoverable onClose={close} updateMargins={updateHoveredMargins} />
    </OverlayPositionOnCentroid>
  )
}
