import { useState } from 'react'

import { ReportingCard } from './ReportingCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

const MARGINS = {
  xLeft: 50,
  xMiddle: 30,
  xRight: -55,
  yBottom: 50,
  yMiddle: 50,
  yTop: -55
}
export function ReportingOverlay({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const selectedReportingIdOnMap = useAppSelector(state => state.reporting.selectedReportingIdOnMap)

  const displayReportingsOverlay = useAppSelector(state => state.global.displayReportingsOverlay)
  const [hoveredMargins, setHoveredMargins] = useState(MARGINS)
  const [selectedMargins, setSelectedMargins] = useState(MARGINS)

  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.REPORTINGS.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.REPORTINGS.code}:${selectedReportingIdOnMap}`)
  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.REPORTINGS.code) &&
    currentfeatureId !== `${Layers.REPORTINGS.code}:${selectedReportingIdOnMap}`

  const updateHoveredMargins = (cardHeight: number) => {
    if (MARGINS.yTop - cardHeight !== hoveredMargins.yTop) {
      setHoveredMargins({ ...hoveredMargins, yTop: MARGINS.yTop - cardHeight })
    }
  }

  const updateSelectedMargins = (cardHeight: number) => {
    if (MARGINS.yTop - cardHeight !== selectedMargins.yTop) {
      setSelectedMargins({ ...selectedMargins, yTop: MARGINS.yTop - cardHeight })
    }
  }

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-selected"
        feature={displayReportingsOverlay ? feature : undefined}
        featureIsShowed
        map={map}
        options={{ margins: selectedMargins }}
        zIndex={5000}
      >
        <ReportingCard feature={feature} selected updateMargins={updateSelectedMargins} />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-hover"
        feature={displayReportingsOverlay && displayHoveredFeature ? currentFeatureOver : undefined}
        map={map}
        options={{ margins: hoveredMargins }}
        zIndex={5000}
      >
        <ReportingCard feature={currentFeatureOver} updateMargins={updateHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
}
