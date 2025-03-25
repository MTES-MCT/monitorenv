import { OverlayPositionOnCentroid } from '@features/map/overlays/OverlayPositionOnCentroid'
import { OverlayPositionOnCoordinates } from '@features/map/overlays/OverlayPositionOnCoordinate'
import { useAppSelector, useShallowEqualSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { findMapFeatureById } from '@utils/findMapFeatureById'
import { Layers } from 'domain/entities/layers/constants'
import { createPortal } from 'react-dom'

import { HoveredOverlay } from './HoveredOverlay'
import { RecentActivityControlCard } from './RecentActivityControlCard'
import { SelectedOverlay } from './SelectedOverlay'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { RecentActivity } from '@features/RecentActivity/types'
import type { OverlayItem } from 'domain/types/map'

export const FEATURE_ID = 'RecentActivityAreaIconFeature'

export function RecentActvityOverlay({ currentFeatureListOver, map, mapClickEvent, pixel }: BaseMapChildrenProps) {
  const layerOverlayItems = useShallowEqualSelector(state => state.recentActivity.layersAndOverlays.layerOverlayItems)
  const layerOverlayCoordinates = useShallowEqualSelector(
    state => state.recentActivity.layersAndOverlays.layerOverlayCoordinates
  )
  const isControlsListClicked = useAppSelector(state => state.recentActivity.layersAndOverlays.isControlsListClicked)
  const selectedControlId = useAppSelector(state => state.recentActivity.layersAndOverlays.selectedControlId)
  const hasMapListener = useHasMapInteraction()

  const hoveredItems = currentFeatureListOver?.reduce((acc, recentActivityFeature) => {
    const type = String(recentActivityFeature.id).split(':')[0]

    if (type === Layers.RECENT_CONTROLS_ACTIVITY.code) {
      const { properties } = recentActivityFeature

      if (!properties) {
        return acc
      }

      acc.push({
        layerType: type,
        properties: properties as RecentActivity.RecentControlsActivity
      })
    }

    return acc
  }, [] as OverlayItem<string, RecentActivity.RecentControlsActivity>[])

  const isHoveredOverlayVisible = !hasMapListener && hoveredItems && hoveredItems.length > 0 && pixel

  const isHoveredFeatureSameAsSelected =
    hoveredItems?.length === 1 && hoveredItems[0] && selectedControlId === hoveredItems[0].properties.id

  const selectedFeature = findMapFeatureById(
    map,
    Layers.RECENT_CONTROLS_ACTIVITY.code,
    `${Layers.RECENT_CONTROLS_ACTIVITY.code}:${selectedControlId}`
  )

  const hoveredFeature =
    hoveredItems && hoveredItems.length === 1 && hoveredItems[0]
      ? findMapFeatureById(
          map,
          Layers.RECENT_CONTROLS_ACTIVITY.code,
          `${Layers.RECENT_CONTROLS_ACTIVITY.code}:${hoveredItems?.[0].properties.id}`
        )
      : undefined

  return (
    <>
      {/* To display list of recent controls after click */}
      <OverlayPositionOnCoordinates
        coordinates={layerOverlayCoordinates}
        layerOverlayIsOpen={isControlsListClicked}
        map={map}
        name={`${Layers.RECENT_ACTIVITY_AREA_ICON}:${FEATURE_ID}`}
      >
        {isControlsListClicked && layerOverlayItems && <SelectedOverlay items={layerOverlayItems} />}
      </OverlayPositionOnCoordinates>

      {/* To display recent control after click */}
      <OverlayPositionOnCentroid
        appClassName="overlay-recent-control-activity-selected"
        feature={selectedControlId ? selectedFeature : undefined}
        map={map}
        mapClickEvent={mapClickEvent}
        zIndex={5000}
      >
        {selectedControlId && selectedFeature && <RecentActivityControlCard control={selectedFeature} isSelected />}
      </OverlayPositionOnCentroid>

      {/* If only one recent controls hovered */}
      <OverlayPositionOnCentroid
        appClassName="overlay-recent-control-activity-hovered"
        feature={hoveredFeature}
        map={map}
        mapClickEvent={mapClickEvent}
        zIndex={5000}
      >
        {isHoveredOverlayVisible && hoveredFeature && !isHoveredFeatureSameAsSelected && (
          <RecentActivityControlCard control={hoveredFeature} />
        )}
      </OverlayPositionOnCentroid>

      {/* To display list of recent controls on hover */}
      {createPortal(
        isHoveredOverlayVisible && hoveredItems.length > 1 && !isControlsListClicked && (
          <HoveredOverlay items={hoveredItems} pixel={pixel} singleFeature={hoveredFeature} />
        ),
        document.body
      )}
    </>
  )
}
