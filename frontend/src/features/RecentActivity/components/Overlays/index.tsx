// import { useAppSelector, useShallowEqualSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { Layers } from 'domain/entities/layers/constants'
import { createPortal } from 'react-dom'

/* import { HoveredOverlay } from './HoveredOverlay'
import { OverlayPositionOnCoordinates } from './OverlayPositionOnCoordinate'
import { PinnedOverlay } from './PinnedOverlay'
 */
import { HoveredOverlay } from './HoveredOverlay'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { RecentActivity } from '@features/RecentActivity/types'
import type { OverlayItem } from 'domain/types/map'

export function RecentActvityOverlay({ currentFeatureListOver, pixel }: BaseMapChildrenProps) {
  /*  const layerOverlayItems = useShallowEqualSelector(state => state.recentActivity.layersAndOverlays.layerOverlayItems)
 const layerOverlayCoordinates = useShallowEqualSelector(
    state => state.recentActivity.layersAndOverlays.layerOverlayCoordinates
  )
  const isControlsListClicked = useAppSelector(state => state.recentActivity.layersAndOverlays.isControlsListClicked) */
  const hasMapListener = useHasMapInteraction()

  const hoveredItems = currentFeatureListOver?.reduce((acc, recentActivityFeature) => {
    const type = String(recentActivityFeature.id).split(':')[0]

    if (type === Layers.RECENT_CONTROLS_ACTIVITY.code) {
      const { properties } = recentActivityFeature

      acc.push({
        layerType: type,
        properties: properties as RecentActivity.RecentControlsActivity
      })
    }

    return acc
  }, [] as OverlayItem<string, RecentActivity.RecentControlsActivity>[])

  const isHoveredOverlayVisible = !hasMapListener && hoveredItems && hoveredItems.length > 0 && pixel

  return (
    <>
      {/*  <OverlayPositionOnCoordinates
        coordinates={layerOverlayCoordinates}
        layerOverlayIsOpen={isControlsListClicked}
        map={map}
      >
        {isControlsListClicked && <PinnedOverlay items={layerOverlayItems} />}
      </OverlayPositionOnCoordinates>
 */}
      {createPortal(
        isHoveredOverlayVisible && <HoveredOverlay items={hoveredItems} pixel={pixel} />,
        document.body as HTMLElement
      )}
    </>
  )
}
