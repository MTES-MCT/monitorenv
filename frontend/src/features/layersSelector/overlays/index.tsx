import { getHoveredItems } from '@features/map/utils'
import { getIsLinkingZonesToVigilanceArea, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { useAppSelector, useShallowEqualSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import { memo, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { HoveredOverlay } from './HoveredOverlay'
import { PinnedOverlay } from './PinnedOverlay'
import { OverlayPositionOnCoordinates } from '../../map/overlays/OverlayPositionOnCoordinate'

export const FEATURE_ID = 'AreaIconFeature'

export const LayersOverlay = memo(() => {
  const { currentFeatureListOver, map, pixel } = useMapContext()

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

  const hoveredItems = useMemo(
    () => getHoveredItems(currentFeatureListOver, isLinkingZonesToVigilanceArea),
    [currentFeatureListOver, isLinkingZonesToVigilanceArea]
  )

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
        name={`${Layers.AREA_ICON}:${FEATURE_ID}`}
      >
        {layerOverlayIsOpen && <PinnedOverlay items={layerOverlayItems} />}
      </OverlayPositionOnCoordinates>
      {createPortal(
        <HoveredOverlay isVisible={!!isHoveredOverlayVisible} items={hoveredItems} pixel={pixel} />,
        document.body
      )}
    </>
  )
})
