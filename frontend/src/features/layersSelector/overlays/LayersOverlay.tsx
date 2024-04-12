import { getHoveredItems } from '@features/map/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { createPortal } from 'react-dom'

import { OverlayContent } from './OverlayContent'
import { OverlayMenu } from './OverlayMenu'
import { OverlayPositionOnCoordinates } from './OverlayPositionOnCoordinate'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function LayersOverlay({ currentFeatureListOver, map, pixel }: BaseMapChildrenProps) {
  const { layerOverlayCoordinates, layerOverlayIsOpen, layerOverlayItems } = useAppSelector(
    state => state.layersMetadata
  )
  const hoveredItems = getHoveredItems(currentFeatureListOver)

  return (
    <>
      <OverlayPositionOnCoordinates
        coordinates={layerOverlayCoordinates}
        layerOverlayIsOpen={layerOverlayIsOpen}
        map={map}
      >
        {layerOverlayIsOpen && <OverlayContent items={layerOverlayItems} />}
      </OverlayPositionOnCoordinates>
      {createPortal(
        !layerOverlayIsOpen && hoveredItems && hoveredItems.length > 0 && pixel && (
          <OverlayMenu items={hoveredItems} pixel={pixel} />
        ),
        document.body as HTMLElement
      )}
    </>
  )
}
