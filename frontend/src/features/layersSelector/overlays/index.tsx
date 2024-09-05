import { getHoveredItems } from '@features/map/utils'
import { getIsLinkingZonesToVigilanceArea, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppSelector, useShallowEqualSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
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

  const hasMapListener = useHasMapInteraction()
  const isDrawingVigilanceArea = useAppSelector(
    state => state.vigilanceArea.formTypeOpen === VigilanceAreaFormTypeOpen.DRAW
  )
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const hoveredItems = getHoveredItems(currentFeatureListOver, isLinkingZonesToVigilanceArea)

  const isHoveredOverlayVisible =
    !layerOverlayIsOpen &&
    !hasMapListener &&
    hoveredItems &&
    hoveredItems.length > 0 &&
    pixel &&
    !isDrawingVigilanceArea

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
        isHoveredOverlayVisible && <HoveredOverlay items={hoveredItems} pixel={pixel} />,
        document.body as HTMLElement
      )}
    </>
  )
}
