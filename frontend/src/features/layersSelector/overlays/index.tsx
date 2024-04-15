import { getHoveredItems } from '@features/map/utils'
import { useShallowEqualSelector } from '@hooks/useAppSelector'
import { createPortal } from 'react-dom'

import { HoveredOverlay } from './HoveredOverlay'
import { OverlayPositionOnCoordinates } from './OverlayPositionOnCoordinate'
import { PinnedOverlay } from './PinnedOverlay'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function LayersOverlay({ currentFeatureListOver, map, pixel }: BaseMapChildrenProps) {
  const { layerOverlayCoordinates, layerOverlayIsOpen, layerOverlayItems } = useShallowEqualSelector(state => ({
    layerOverlayCoordinates: state.layersMetadata.layerOverlayCoordinates,
    layerOverlayIsOpen: state.layersMetadata.layerOverlayIsOpen,
    layerOverlayItems: state.layersMetadata.layerOverlayItems
  }))
  const hoveredItems = getHoveredItems(currentFeatureListOver)

  return (
    <>
      <OverlayPositionOnCoordinates
        coordinates={layerOverlayCoordinates}
        layerOverlayIsOpen={layerOverlayIsOpen}
        map={map}
      >
        {layerOverlayIsOpen && <PinnedOverlay items={layerOverlayItems} />}
      </OverlayPositionOnCoordinates>
      {createPortal(
        !layerOverlayIsOpen && hoveredItems && hoveredItems.length > 0 && pixel && (
          <HoveredOverlay items={hoveredItems} pixel={pixel} />
        ),
        document.body as HTMLElement
      )}
    </>
  )
}
