import { useMemo } from 'react'

import { BaseCard } from './BaseCard'
import { OVERLAY_MARGINS } from './constants'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { findMapFeatureById } from '../../../../utils/findMapFeatureById'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function BaseOverlay({ currentFeatureOver: hoveredFeature, map }: BaseMapChildrenProps) {
  const selectedBaseFeatureId = useAppSelector(state => state.base.selectedBaseFeatureId)

  const selectedFeature = useMemo(
    () => findMapFeatureById(map, Layers.BASES.code, selectedBaseFeatureId),

    // We ignore `map` dependency because it's an instance and it's not supposed to change.
    // Moreover, it will be refactored into a non-React instance later on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBaseFeatureId]
  )
  const hoveredFeatureId = hoveredFeature?.getId()?.toString()
  const canDisplayHoveredFeature =
    !!hoveredFeatureId?.startsWith(Layers.BASES.code) && hoveredFeatureId !== selectedBaseFeatureId

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-base-hover"
        feature={canDisplayHoveredFeature && hoveredFeature}
        map={map}
        options={{ margins: OVERLAY_MARGINS }}
      >
        {canDisplayHoveredFeature && hoveredFeature && <BaseCard feature={hoveredFeature} />}
      </OverlayPositionOnCentroid>

      <OverlayPositionOnCentroid
        appClassName="overlay-base-selected"
        feature={selectedFeature}
        featureIsShowed
        map={map}
        options={{ margins: OVERLAY_MARGINS }}
      >
        {selectedFeature && <BaseCard feature={selectedFeature} selected />}
      </OverlayPositionOnCentroid>
    </>
  )
}
