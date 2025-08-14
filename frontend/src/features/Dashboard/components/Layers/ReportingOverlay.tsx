import { dashboardActions, getReportingToDisplay } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { ReportingCard } from '@features/Reportings/components/ReportingOverlay/Reporting/ReportingCard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { findMapFeatureById } from '@utils/findMapFeatureById'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { memo, useCallback, useMemo, useState } from 'react'

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
export const DashboardReportingOverlay = memo(() => {
  const { currentFeatureOver, map, mapClickEvent } = useMapContext()

  const dispatch = useAppDispatch()
  const selectedReporting = useAppSelector(state => getReportingToDisplay(state.dashboard))
  const displayDashboardLayer = useAppSelector(state => state.global.layers.displayDashboardLayer)

  const [reportingHoveredOptions, setReportingHoveredOptions] = useState(OPTIONS)
  const [reportingSelectedOptions, setReportingSelectedOptions] = useState(OPTIONS)

  const feature = useMemo(
    () =>
      findMapFeatureById(
        map,
        Layers.DASHBOARD_PREVIEW.code,
        `${Dashboard.Layer.DASHBOARD_REPORTINGS}:${selectedReporting?.id}`
      ),
    [map, selectedReporting?.id]
  )

  const canOverlayBeOpened = useAppSelector(state =>
    isOverlayOpened(state.global, `${Dashboard.Layer.DASHBOARD_REPORTINGS}:${selectedReporting?.id}`)
  )

  const hoveredFeature = convertToFeature(currentFeatureOver)

  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' && currentfeatureId.startsWith(Dashboard.Layer.DASHBOARD_REPORTINGS)

  const updateReportingSelectedMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== reportingSelectedOptions.margins.yTop) {
        setReportingSelectedOptions({
          margins: { ...reportingSelectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight }
        })
      }
    },
    [reportingSelectedOptions.margins]
  )
  const updateReportingHoveredMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== reportingHoveredOptions.margins.yTop) {
        setReportingHoveredOptions({
          margins: { ...reportingHoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight }
        })
      }
    },
    [reportingHoveredOptions.margins]
  )

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
        options={reportingSelectedOptions}
        zIndex={5000}
      >
        <ReportingCard feature={feature} onClose={close} selected updateMargins={updateReportingSelectedMargins} />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-hover"
        feature={displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={reportingHoveredOptions}
        zIndex={5000}
      >
        <ReportingCard feature={hoveredFeature} onClose={close} updateMargins={updateReportingHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
})
