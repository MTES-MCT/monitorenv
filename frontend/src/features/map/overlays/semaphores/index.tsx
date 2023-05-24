import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../OverlayPositionOnCentroid'
import { SemaphoreCard } from './SemaphoreCard'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { MapChildrenProps } from '../../Map'

export function SemaphoreOverlay({ currentFeatureOver, map }: MapChildrenProps) {
  const { selectedSemaphoreId } = useAppSelector(state => state.semaphoresState)
  const { displaySemaphoreOverlay } = useAppSelector(state => state.global)
  const feature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.SEMAPHORES.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`)
  const currentfeatureId = currentFeatureOver?.getId()
  const displayHoveredFeature =
    typeof currentfeatureId === 'string' &&
    currentfeatureId.startsWith(Layers.SEMAPHORES.code) &&
    currentfeatureId !== `${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`

  return (
    <>
      <OverlayPositionOnCentroid
        appClassName="overlay-semaphore-selected"
        feature={displaySemaphoreOverlay ? feature : undefined}
        featureIsShowed
        map={map}
      >
        <SemaphoreCard feature={feature} selected />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-semaphore-hover"
        feature={displaySemaphoreOverlay && displayHoveredFeature ? currentFeatureOver : undefined}
        map={map}
      >
        <SemaphoreCard feature={currentFeatureOver} />
      </OverlayPositionOnCentroid>
    </>
  )
}
