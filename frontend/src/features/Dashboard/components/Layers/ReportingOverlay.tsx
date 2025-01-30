import { dashboardActions, getReportingToDisplay } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { ReportingCard } from '@features/Reportings/components/ReportingOverlay/Reporting/ReportingCard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
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
export function DashboardReportingOverlay({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const selectedReporting = useAppSelector(state => getReportingToDisplay(state.dashboard))
  const displayDashboardLayer = useAppSelector(state => state.global.layers.displayDashboardLayer)

  const [hoveredOptions, setHoveredOptions] = useState(OPTIONS)
  const [selectedOptions, setSelectedOptions] = useState(OPTIONS)

  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') &&
        (l as VectorLayerWithName).name === Layers.DASHBOARD_PREVIEW.code
    )
    ?.getSource()
    ?.getFeatureById(`${Dashboard.Layer.DASHBOARD_REPORTINGS}:${selectedReporting?.id}`)

  const canOverlayBeOpened = useAppSelector(state =>
    isOverlayOpened(state.global, `${Dashboard.Layer.DASHBOARD_REPORTINGS}:${selectedReporting?.id}`)
  )

  const hoveredFeature = convertToFeature(currentFeatureOver)

  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Dashboard.Layer.DASHBOARD_REPORTINGS)

  const updateSelectedMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== selectedOptions.margins.yTop) {
      setSelectedOptions({ margins: { ...selectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }
  const updateHoveredMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== hoveredOptions.margins.yTop) {
      setHoveredOptions({ margins: { ...hoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

  const close = () => {
    dispatch(dashboardActions.setSelectedReporting(undefined))
  }

  return (
    <>
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
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-hover"
        feature={displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={hoveredOptions}
        zIndex={5000}
      >
        <ReportingCard feature={hoveredFeature} onClose={close} updateMargins={updateHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
}
