import { useMemo } from 'react'

import { OVERLAY_MARGINS } from './constants'
import { StationCard } from './StationCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { findMapFeatureById } from '../../../../utils/findMapFeatureById'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function StationOverlay({ currentFeatureOver: hoveredFeature, map }: BaseMapChildrenProps) {
  const selectedBaseFeatureId = useAppSelector(state => state.station.selectedFeatureId)

  const selectedFeature = useMemo(
    () => findMapFeatureById(map, Layers.STATIONS.code, selectedBaseFeatureId),

    // We ignore `map` dependency because it's an instance and it's not supposed to change.
    // Moreover, it will be refactored into a non-React instance later on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBaseFeatureId]
  )
  const hoveredFeatureId = hoveredFeature?.getId()?.toString()
  const canDisplayHoveredFeature =
    !!hoveredFeatureId?.startsWith(Layers.STATIONS.code) && hoveredFeatureId !== selectedBaseFeatureId

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-station-hover"
        feature={canDisplayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        options={{ margins: OVERLAY_MARGINS }}
        zIndex={4000}
      >
        {canDisplayHoveredFeature && hoveredFeature && <StationCard feature={hoveredFeature} />}
      </OverlayPositionOnCentroid>

      <OverlayPositionOnCentroid
        appClassName="overlay-station-selected"
        feature={selectedFeature}
        featureIsShowed
        map={map}
        options={{ margins: OVERLAY_MARGINS }}
        zIndex={4000}
      >
        {selectedFeature && <StationCard feature={selectedFeature} selected />}
      </OverlayPositionOnCentroid>
    </>
  )
}
