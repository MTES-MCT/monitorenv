import { convertToFeature } from 'domain/types/map'

import { SemaphoreCard } from './SemaphoreCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

const MARGINS = {
  xLeft: 50,
  xMiddle: 30,
  xRight: -55,
  yBottom: 50,
  yMiddle: 100,
  yTop: -170
}
export function SemaphoreOverlay({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const selectedSemaphoreId = useAppSelector(state => state.semaphoresSlice.selectedSemaphoreId)
  const displaySemaphoreOverlay = useAppSelector(state => state.global.displaySemaphoreOverlay)

  const selectedFeature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.SEMAPHORES.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`)

  const hoveredFeature = convertToFeature(currentFeatureOver)
  const currentfeatureId = hoveredFeature?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.SEMAPHORES.code) &&
    currentfeatureId !== `${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-semaphore-selected"
        feature={displaySemaphoreOverlay ? selectedFeature : undefined}
        featureIsShowed
        map={map}
        options={{ margins: MARGINS }}
        zIndex={3000}
      >
        <SemaphoreCard feature={selectedFeature} selected />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-semaphore-hover"
        feature={displaySemaphoreOverlay && displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        options={{ margins: MARGINS }}
        zIndex={3000}
      >
        <SemaphoreCard feature={hoveredFeature} />
      </OverlayPositionOnCentroid>
    </>
  )
}
