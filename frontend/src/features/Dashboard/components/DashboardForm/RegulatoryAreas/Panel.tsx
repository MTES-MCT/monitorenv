import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEffect } from 'react'

import { RegulatoryAreasPanel } from '../components/RegulatoryAreasPanel'

export function RegulatoryPanel({ className, dashboardId }: { className: string; dashboardId: number }) {
  const dispatch = useAppDispatch()
  const openPanel = useAppSelector(state => state.dashboard.dashboards?.[dashboardId]?.openPanel)

  const onCloseIconClicked = () => {
    dispatch(dashboardActions.setDashboardPanel())
  }

  useEffect(
    () => () => {
      dispatch(dashboardActions.setDashboardPanel())
    },
    [dispatch]
  )

  if (!openPanel || openPanel.type !== Dashboard.Block.REGULATORY_AREAS) {
    return null
  }

  return <RegulatoryAreasPanel className={className} id={openPanel.id} onClose={onCloseIconClicked} />
}
