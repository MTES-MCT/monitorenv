import { useRecentActivitylayer } from '@features/RecentActivity/hooks/useRecentActivityLayer'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function RecentControlsActivityLayer({ map }: BaseMapChildrenProps) {
  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const hasMapInteraction = useHasMapInteraction()

  const filters = useAppSelector(state => state.recentActivity.filters)
  const drawedGeometry = useAppSelector(state => state.recentActivity.drawedGeometry)
  const selectedControlId = useAppSelector(state => state.recentActivity.layersAndOverlays.selectedControlId)

  const overlayCoordinates = useAppSelector(state =>
    getOverlayCoordinates(state.global, `${Layers.RECENT_CONTROLS_ACTIVITY.code}:${selectedControlId}`)
  )
  const isLayerVisible = displayRecentActivityLayer && !hasMapInteraction
  useRecentActivitylayer({
    drawedGeometry,
    filters,
    isLayerVisible,
    layerName: Layers.RECENT_CONTROLS_ACTIVITY.code,
    map,
    overlayCoordinates,
    selectedControlId
  })

  return null
}
