import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useState } from 'react'

import { useExportImages } from './useExportImages'
import { getRecentActivityFilters } from '../components/DashboardForm/slice'
import { Dashboard } from '../types'
import { exportBrief } from '../useCases/exportBrief'

export function useGenerateEditableBrief(dashboard: Dashboard.Dashboard) {
  const dispatch = useAppDispatch()
  const [isLoadingBrief, setIsLoadingBrief] = useState(false)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const recentActivityFilters = useAppSelector(state =>
    getRecentActivityFilters(state.dashboardFilters, activeDashboardId)
  )

  const { getImages } = useExportImages()

  const downloadEditableBrief = async () => {
    setIsLoadingBrief(true)
    await dispatch(exportBrief({ dashboard, getImages, recentActivityFilters }))
    setIsLoadingBrief(false)
  }

  return { downloadEditableBrief, isLoadingEditableBrief: isLoadingBrief }
}
