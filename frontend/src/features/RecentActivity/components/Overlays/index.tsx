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

import type { RecentActivity } from '@features/RecentActivity/types'
import type { OverlayItem } from 'domain/types/map'
import type { BaseMapChildrenWithSuperUserProps } from 'types'

export const FEATURE_ID = 'RecentActivityAreaIconFeature'

export function RecentActvityOverlay({
  currentFeatureListOver,
  isSuperUser,
  map,
  mapClickEvent,
  pixel
}: BaseMapChildrenWithSuperUserProps) {
  const layerOverlayItems = useShallowEqualSelector(state => state.recentActivity.layersAndOverlays.layerOverlayItems)
  const layerOverlayCoordinates = useShallowEqualSelector(
    state => state.recentActivity.layersAndOverlays.layerOverlayCoordinates
  )
  const isControlsListClicked = useAppSelector(state => state.recentActivity.layersAndOverlays.isControlsListClicked)
  const selectedControlId = useAppSelector(state => state.recentActivity.layersAndOverlays.selectedControlId)
  const hasMapListener = useHasMapInteraction()

  const hoveredItems = currentFeatureListOver?.reduce((acc, recentActivityFeature) => {
    const type = String(recentActivityFeature.id).split(':')[0]

    if (type === Layers.RECENT_CONTROLS_ACTIVITY.code || type === Layers.DASHBOARD_RECENT_ACTIVITY.code) {
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
  const dashboardSelectedFeature = findMapFeatureById(
    map,
    Layers.DASHBOARD_RECENT_ACTIVITY.code,
    `${Layers.DASHBOARD_RECENT_ACTIVITY.code}:${selectedControlId}`
  )

  const hoveredFeature =
    hoveredItems && hoveredItems.length === 1 && hoveredItems[0]
      ? findMapFeatureById(
          map,
          Layers.RECENT_CONTROLS_ACTIVITY.code,
          `${Layers.RECENT_CONTROLS_ACTIVITY.code}:${hoveredItems?.[0].properties.id}`
        )
      : undefined
  const dashboardHoveredFeature =
    hoveredItems && hoveredItems.length === 1 && hoveredItems[0]
      ? findMapFeatureById(
          map,
          Layers.DASHBOARD_RECENT_ACTIVITY.code,
          `${Layers.DASHBOARD_RECENT_ACTIVITY.code}:${hoveredItems?.[0].properties.id}`
        )
      : undefined

  return (
    <>
      {/* To display list of recent controls after click */}
      {isControlsListClicked && layerOverlayItems && (
        <OverlayPositionOnCoordinates
          coordinates={layerOverlayCoordinates}
          layerOverlayIsOpen={isControlsListClicked}
          map={map}
          name={`${Layers.RECENT_ACTIVITY_AREA_ICON}:${FEATURE_ID}`}
        >
          <SelectedOverlay isSuperUser={isSuperUser} items={layerOverlayItems} />
        </OverlayPositionOnCoordinates>
      )}

      {/* To display recent control after click */}
      {selectedControlId && (
        <OverlayPositionOnCentroid
          appClassName="overlay-recent-control-activity-selected"
          feature={selectedFeature ?? dashboardSelectedFeature}
          map={map}
          mapClickEvent={mapClickEvent}
          zIndex={5000}
        >
          {!!(selectedControlId && (selectedFeature || dashboardSelectedFeature)) && (
            <RecentActivityControlCard
              control={selectedFeature ?? dashboardSelectedFeature}
              isSelected
              isSuperUser={isSuperUser}
            />
          )}
        </OverlayPositionOnCentroid>
      )}

      {/* If only one recent controls hovered */}
      {(hoveredFeature || dashboardHoveredFeature) && (
        <OverlayPositionOnCentroid
          appClassName="overlay-recent-control-activity-hovered"
          feature={hoveredFeature ?? dashboardHoveredFeature}
          map={map}
          mapClickEvent={mapClickEvent}
          zIndex={5000}
        >
          {isHoveredOverlayVisible &&
            (hoveredFeature || dashboardHoveredFeature) &&
            !isHoveredFeatureSameAsSelected && (
              <RecentActivityControlCard control={hoveredFeature ?? dashboardHoveredFeature} />
            )}
        </OverlayPositionOnCentroid>
      )}

      {/* To display list of recent controls on hover */}
      {createPortal(
        isHoveredOverlayVisible && hoveredItems.length > 1 && !isControlsListClicked && (
          <HoveredOverlay
            items={hoveredItems}
            pixel={pixel}
            singleFeature={hoveredFeature ?? dashboardHoveredFeature}
          />
        ),
        document.body
      )}
    </>
  )
}
