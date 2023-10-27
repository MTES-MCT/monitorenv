import { BaseCard } from './BaseCard'
import { OVERLAY_MARGINS } from './constants'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function BaseOverlay({ currentFeatureOver: hoveredFeature, map }: BaseMapChildrenProps) {
  const base = useAppSelector(state => state.base)
  const global = useAppSelector(state => state.global)

  const selectedFeature = base.selectedBaseFeatureId
    ? map
        ?.getLayers()
        ?.getArray()
        ?.find(
          (l): l is VectorLayerWithName =>
            Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.BASES.code
        )
        ?.getSource()
        ?.getFeatureById(base.selectedBaseFeatureId)
    : undefined
  const hoveredFeatureId = hoveredFeature?.getId()?.toString()
  const canDisplayHoveredFeature =
    global.displayBaseOverlay &&
    hoveredFeatureId?.startsWith(Layers.BASES.code) &&
    hoveredFeatureId !== base.selectedBaseFeatureId

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
        feature={global.displayBaseOverlay ? selectedFeature : undefined}
        featureIsShowed
        map={map}
        options={{ margins: OVERLAY_MARGINS }}
      >
        {selectedFeature && <BaseCard feature={selectedFeature} selected />}
      </OverlayPositionOnCentroid>
    </>
  )
}
