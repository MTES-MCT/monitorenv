import { useGetVigilanceAreasByIdsQuery } from '@api/vigilanceAreasAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useState } from 'react'
import { Axis } from 'types'

import { useExportImages } from './useExportImages'
import { getRecentActivityFilters } from '../components/DashboardForm/slice'
import { Dashboard } from '../types'
import { exportBrief } from '../useCases/exportBrief'

export function useGenerateEditableBrief(dashboard: Dashboard.Dashboard) {
  const dispatch = useAppDispatch()
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const axis =
    useAppSelector(state => (activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.axis : undefined)) ??
    Axis.NORTH_SOUTH

  const recentActivityFilters = useAppSelector(state =>
    getRecentActivityFilters(state.dashboardFilters, activeDashboardId)
  )
  const nearbyUnits = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.selectedNearbyUnits : []
  )

  const { data: vigilanceAreas } = useGetVigilanceAreasByIdsQuery({ axis, ids: dashboard.vigilanceAreaIds })

  const { getImages } = useExportImages()

  const downloadEditableBrief = async () => {
    setIsLoadingBrief(true)
    await dispatch(exportBrief({ dashboard, getImages, nearbyUnits, recentActivityFilters, vigilanceAreas }))
    setIsLoadingBrief(false)
  }

  return { downloadEditableBrief, isLoadingEditableBrief: isLoadingBrief }
}
