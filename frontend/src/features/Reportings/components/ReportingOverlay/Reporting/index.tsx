import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { reportingActions } from '@features/Reportings/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened, removeOverlayStroke } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { useMemo, useState } from 'react'

import { ReportingCard } from './ReportingCard'

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
type ReportingOverlayProps = BaseMapChildrenProps & {
  isSuperUser: boolean
}

export function ReportingOverlay({ currentFeatureOver, isSuperUser, map, mapClickEvent }: ReportingOverlayProps) {
  const dispatch = useAppDispatch()
  const selectedReportingIdOnMap = useAppSelector(state => state.reporting.selectedReportingIdOnMap)

  const listener = useAppSelector(state => state.draw.listener)
  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )
  const displayReportingsLayer = useAppSelector(state => state.global.layers.displayReportingsLayer)
  const displayReportingsOverlay = useAppSelector(state => state.global.layers.displayReportingsOverlay)
  const [hoveredOptions, setHoveredOptions] = useState(OPTIONS)
  const [selectedOptions, setSelectedOptions] = useState(OPTIONS)

  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.REPORTINGS.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.REPORTINGS.code}:${selectedReportingIdOnMap}`)

  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(feature?.getId())))

  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.REPORTINGS.code) &&
    currentfeatureId !== `${Layers.REPORTINGS.code}:${selectedReportingIdOnMap}`

  const isCardVisible = useMemo(
    () => displayReportingsLayer && !listener && !isMissionAttachmentInProgress,
    [displayReportingsLayer, listener, isMissionAttachmentInProgress]
  )

  const updateHoveredMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== hoveredOptions.margins.yTop) {
      setHoveredOptions({ margins: { ...hoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

  const updateSelectedMargins = (cardHeight: number) => {
    if (OPTIONS.margins.yTop - cardHeight !== selectedOptions.margins.yTop) {
      setSelectedOptions({ margins: { ...selectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
    }
  }

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
        <ReportingCard
          feature={feature}
          isCardVisible={isCardVisible}
          isSuperUser={isSuperUser}
          onClose={close}
          selected
          updateMargins={updateSelectedMargins}
        />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-reporting-hover"
        feature={displayReportingsOverlay && displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={hoveredOptions}
        zIndex={5000}
      >
        <ReportingCard
          feature={hoveredFeature}
          isCardVisible={isCardVisible}
          isSuperUser={isSuperUser}
          onClose={close}
          updateMargins={updateHoveredMargins}
        />
      </OverlayPositionOnCentroid>
    </>
  )
}
