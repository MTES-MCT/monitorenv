import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { reportingActions } from '@features/Reportings/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { findMapFeatureById } from '@utils/findMapFeatureById'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened, removeOverlayStroke } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { useCallback, memo, useMemo, useState } from 'react'

import { ReportingCard } from './ReportingCard'

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

export const ReportingOverlay = memo(() => {
  const { currentFeatureOver, map, mapClickEvent } = useMapContext()

  const dispatch = useAppDispatch()
  const selectedReportingIdOnMap = useAppSelector(state => state.reporting.selectedReportingIdOnMap)

  const displayReportingsOverlay = useAppSelector(state => state.global.layers.displayReportingsOverlay)
  const [hoveredOptions, setHoveredOptions] = useState(OPTIONS)
  const [selectedOptions, setSelectedOptions] = useState(OPTIONS)

  const feature = useMemo(
    () => findMapFeatureById(map, Layers.REPORTINGS.code, `${Layers.REPORTINGS.code}:${selectedReportingIdOnMap}`),
    [map, selectedReportingIdOnMap]
  )
  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(feature?.getId())))

  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.REPORTINGS.code) &&
    currentfeatureId !== `${Layers.REPORTINGS.code}:${selectedReportingIdOnMap}`

  const updateHoveredMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== hoveredOptions.margins.yTop) {
        setHoveredOptions({ margins: { ...hoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
      }
    },
    [hoveredOptions.margins]
  )

  const updateSelectedMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== selectedOptions.margins.yTop) {
        setSelectedOptions({ margins: { ...selectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
      }
    },
    [selectedOptions.margins]
  )

  const close = () => {
    dispatch(reportingActions.setSelectedReportingIdOnMap(undefined))
    dispatch(removeOverlayStroke())
  }

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-selected"
        feature={displayReportingsOverlay && canOverlayBeOpened ? feature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={selectedOptions}
        zIndex={5000}
      >
        <ReportingCard feature={feature} onClose={close} selected updateMargins={updateSelectedMargins} />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-hover"
        feature={displayReportingsOverlay && displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={hoveredOptions}
        zIndex={5000}
      >
        <ReportingCard feature={hoveredFeature} onClose={close} updateMargins={updateHoveredMargins} />
      </OverlayPositionOnCentroid>
    </>
  )
})
