import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import { useMemo } from 'react'

import { OVERLAY_MARGINS } from './constants'
import { StationCard } from './StationCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { findMapFeatureById } from '../../../../utils/findMapFeatureById'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function StationOverlay({ currentFeatureOver, map, mapClickEvent }: BaseMapChildrenProps) {
  const selectedBaseFeatureId = useAppSelector(state => state.station.selectedFeatureId)
  const hoveredFeature = convertToFeature(currentFeatureOver)
  const missionCenteredControlUnitId = useAppSelector(state => state.missionForms.missionCenteredControlUnitId)

  const layerName = missionCenteredControlUnitId ? Layers.MISSION_STATION.code : Layers.STATIONS.code
  const selectedFeature = useMemo(
    () => findMapFeatureById(map, layerName, selectedBaseFeatureId),

    // We ignore `map` dependency because it's an instance and it's not supposed to change.
    // Moreover, it will be refactored into a non-React instance later on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBaseFeatureId]
  )
  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(selectedFeature?.getId())))

  const hoveredFeatureId = hoveredFeature?.getId()?.toString()
  const canDisplayHoveredFeature =
    !!hoveredFeatureId?.startsWith(layerName) && hoveredFeatureId !== selectedBaseFeatureId

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-station-selected"
        feature={canOverlayBeOpened ? selectedFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={{ margins: OVERLAY_MARGINS }}
        zIndex={4000}
      >
        {selectedFeature && <StationCard feature={selectedFeature} selected />}
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-station-hover"
        feature={canDisplayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={{ margins: OVERLAY_MARGINS }}
        zIndex={4000}
      >
        {canDisplayHoveredFeature && hoveredFeature && <StationCard feature={hoveredFeature} />}
      </OverlayPositionOnCentroid>
    </>
  )
}
