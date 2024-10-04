import { dashboardActions, getSelectedReporting } from '@features/Dashboard/slice'
import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { ReportingCard } from '@features/Reportings/components/ReportingOverlay/Reporting/ReportingCard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened } from 'domain/shared_slices/Global'
import { useState } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'

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
export function DashboardReportingOverlay({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const selectedReporting = useAppSelector(state => getSelectedReporting(state.dashboard))
  const displayDashboardLayer = useAppSelector(state => state.global.displayDashboardLayer)

  const [selectedOptions, setSelectedOptions] = useState(OPTIONS)

  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.DASHBOARD.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.DASHBOARD.code}:${selectedReporting?.id}`)

  const canOverlayBeOpened = useAppSelector(state =>
    isOverlayOpened(state.global, `${Layers.DASHBOARD.code}:${selectedReporting?.id}`)
  )

  const updateSelectedMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== selectedOptions.margins.yTop) {
      setSelectedOptions({ margins: { ...selectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

  const close = () => {
    dispatch(dashboardActions.setSelectedReporting(undefined))
  }

  return (
    <OverlayPositionOnCentroid
      appClassName="overlay-reporting-selected"
      feature={displayDashboardLayer && canOverlayBeOpened ? feature : undefined}
      map={map}
      mapClickEvent={mapClickEvent}
      options={selectedOptions}
      zIndex={5000}
    >
      <ReportingCard feature={feature} onClose={close} selected updateMargins={updateSelectedMargins} />
    </OverlayPositionOnCentroid>
  )
}
