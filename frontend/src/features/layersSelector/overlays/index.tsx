import { getHoveredItems } from '@features/map/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useShallowEqualSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { HoveredOverlay } from './HoveredOverlay'
import { OverlayPositionOnCoordinates } from './OverlayPositionOnCoordinate'
import { PinnedOverlay } from './PinnedOverlay'
import { closeLayerOverlay } from '../metadataPanel/slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function LayersOverlay({ currentFeatureListOver, map, pixel }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const { layerOverlayCoordinates, layerOverlayIsOpen, layerOverlayItems } = useShallowEqualSelector(state => ({
    layerOverlayCoordinates: state.layersMetadata.layerOverlayCoordinates,
    layerOverlayIsOpen: state.layersMetadata.layerOverlayIsOpen,
    layerOverlayItems: state.layersMetadata.layerOverlayItems
  }))
  const hoveredItems = getHoveredItems(currentFeatureListOver)
  const hasMapListerner = useHasMapInteraction()

  useEffect(() => {
    if (hasMapListerner) {
      dispatch(closeLayerOverlay())
    }
  }, [hasMapListerner, dispatch])

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
        !layerOverlayIsOpen && !hasMapListerner && hoveredItems && hoveredItems.length > 0 && pixel && (
          <HoveredOverlay items={hoveredItems} pixel={pixel} />
        ),
        document.body as HTMLElement
      )}
    </>
  )
}
