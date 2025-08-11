import { dashboardActions } from '@features/Dashboard/slice'
import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { findMapFeatureById } from '@utils/findMapFeatureById'
import { Layers } from 'domain/entities/layers/constants'
import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { useCallback, useMemo, useState } from 'react'

import { DashboardCard } from './DashboardCard'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

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
export function DashboardOverlay({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const [hoveredOptions, setHoveredOptions] = useState(OPTIONS)
  const [selectedOptions, setSelectedOptions] = useState(OPTIONS)
  const displayDashboardLayer = useAppSelector(state => state.global.layers.displayDashboardLayer)

  const selectedDashboardOnMap = useAppSelector(state => state.dashboard.selectedDashboardOnMap)

  const feature = useMemo(
    () => findMapFeatureById(map, Layers.DASHBOARD.code, `${Layers.DASHBOARDS.code}:${selectedDashboardOnMap?.id}`),
    [map, selectedDashboardOnMap?.id]
  )

  const canOverlayBeOpened = useAppSelector(state =>
    isOverlayOpened(state.global, `${Layers.DASHBOARDS.code}:${selectedDashboardOnMap?.id}`)
  )

  const hoveredFeature = convertToFeature(currentFeatureOver)

  const currentfeatureId = hoveredFeature?.getId()

  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.DASHBOARDS.code) &&
    currentfeatureId !== `${Layers.DASHBOARDS.code}:${selectedDashboardOnMap?.id}` &&
    hoveredFeature?.getProperties().dashboard

  const updateSelectedMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== selectedOptions.margins.yTop) {
        setSelectedOptions({ margins: { ...selectedOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
      }
    },
    [selectedOptions.margins]
  )
  const updateHoveredMargins = useCallback(
    (cardHeight: number) => {
      if (OPTIONS.margins.yTop - cardHeight !== hoveredOptions.margins.yTop) {
        setHoveredOptions({ margins: { ...hoveredOptions.margins, yTop: OPTIONS.margins.yTop - cardHeight } })
      }
    },
    [hoveredOptions.margins]
  )

  const close = () => {
    dispatch(dashboardActions.setSelectedDashboardOnMap(undefined))
  }

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-dashboard-selected"
        feature={displayDashboardLayer && canOverlayBeOpened ? feature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={selectedOptions}
        zIndex={5000}
      >
        {selectedDashboardOnMap && (
          <DashboardCard
            dashboardId={selectedDashboardOnMap?.id}
            isSelected
            onClose={close}
            updateMargins={updateSelectedMargins}
          />
        )}
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-dashboard-hover"
        feature={displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={hoveredOptions}
        zIndex={5000}
      >
        {displayHoveredFeature && (
          <DashboardCard
            dashboardId={hoveredFeature?.getProperties().dashboard.id}
            onClose={close}
            updateMargins={updateHoveredMargins}
          />
        )}
      </OverlayPositionOnCentroid>
    </>
  )
}
