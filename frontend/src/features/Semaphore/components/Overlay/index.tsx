import { isOverlayOpened } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'

import { SemaphoreCard } from './SemaphoreCard'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { OverlayPositionOnCentroid } from '../../../map/overlays/OverlayPositionOnCentroid'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

const SUPER_USER_MARGINS = {
  xLeft: 50,
  xMiddle: 30,
  xRight: -55,
  yBottom: 50,
  yMiddle: 100,
  yTop: -250
}

const MARGINS = {
  ...SUPER_USER_MARGINS,
  yBottom: 10,
  yMiddle: 10,
  yTop: -70
}

type SemaphoreOverlayProps = BaseMapChildrenProps & {
  isSuperUser: boolean
}

export function SemaphoreOverlay({ currentFeatureOver, isSuperUser, map, mapClickEvent }: SemaphoreOverlayProps) {
  const selectedSemaphoreId = useAppSelector(state => state.semaphoresSlice.selectedSemaphoreId)

  const selectedFeature = map
    ?.getLayers()
    ?.getArray()
    ?.find(
      (l): l is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(l, 'name') && (l as VectorLayerWithName).name === Layers.SEMAPHORES.code
    )
    ?.getSource()
    ?.getFeatureById(`${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`)

  const canOverlayBeOpened = useAppSelector(state => isOverlayOpened(state.global, String(selectedFeature?.getId())))

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
        feature={canOverlayBeOpened ? selectedFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={{ margins: isSuperUser ? SUPER_USER_MARGINS : MARGINS }}
        zIndex={3000}
      >
        <SemaphoreCard feature={selectedFeature} isSuperUser={isSuperUser} selected />
      </OverlayPositionOnCentroid>
      <OverlayPositionOnCentroid
        appClassName="overlay-semaphore-hover"
        feature={displayHoveredFeature ? hoveredFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        options={{ margins: isSuperUser ? SUPER_USER_MARGINS : MARGINS }}
        zIndex={3000}
      >
        <SemaphoreCard feature={hoveredFeature} isSuperUser={isSuperUser} />
      </OverlayPositionOnCentroid>
    </>
  )
}
