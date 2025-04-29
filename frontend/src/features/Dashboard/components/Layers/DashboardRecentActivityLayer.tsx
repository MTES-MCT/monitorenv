import { dashboardActions, getActiveDashboardId } from '@features/Dashboard/slice'
import { useRecentActivitylayer } from '@features/RecentActivity/hooks/useRecentActivityLayer'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import { useEffect } from 'react'

import { getRecentActivityFilters } from '../DashboardForm/slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function DashboardRecentActivityLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const hasMapInteraction = useHasMapInteraction()

  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))
  const totalOfControls =
    useAppSelector(state => (activeDashboardId ? state.dashboard.dashboards[activeDashboardId]?.totalOfControls : 0)) ??
    0

  const filters = useAppSelector(state => getRecentActivityFilters(state.dashboardFilters, activeDashboardId))

  const selectedControlId = useAppSelector(state => state.recentActivity.layersAndOverlays.selectedControlId)
  const overlayCoordinates = useAppSelector(state =>
    getOverlayCoordinates(state.global, `${Layers.DASHBOARD_RECENT_ACTIVITY.code}:${selectedControlId}`)
  )
  const isLayerVisible = !!activeDashboardId && !hasMapInteraction

  const { controls } = useRecentActivitylayer({
    filters,
    isLayerVisible,
    layerName: Layers.DASHBOARD_RECENT_ACTIVITY.code,
    map,
    overlayCoordinates,
    selectedControlId
  })

  useEffect(() => {
    if (controls && controls?.length !== totalOfControls && activeDashboardId) {
      dispatch(
        dashboardActions.setTotalOfControls({
          key: activeDashboardId,
          totalOfControls: controls?.length ?? 0
        })
      )
    }
  }, [activeDashboardId, controls, totalOfControls, dispatch])

  return null
}
