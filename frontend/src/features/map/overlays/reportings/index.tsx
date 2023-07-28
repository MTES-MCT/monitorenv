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
  yMiddle: 100,
  yTop: 120
}
export function ReportingOverlay({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const { selectedReportingIdOnMap } = useAppSelector(state => state.reportingState)
  const { displayReportingsLayer } = useAppSelector(state => state.global)

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

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-selected"
        feature={displayReportingsLayer ? feature : undefined}
        featureIsShowed
        map={map}
        options={{ margins: MARGINS }}
      >
        <ReportingCard feature={feature} selected />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-hover"
        feature={displayReportingsLayer && displayHoveredFeature ? currentFeatureOver : undefined}
        map={map}
        options={{ margins: MARGINS }}
      >
        <ReportingCard feature={currentFeatureOver} />
      </OverlayPositionOnCentroid>
    </>
  )
}
