import { useAppSelector } from '@hooks/useAppSelector'

import { DashboardForm } from './DashboardForm'

export function DashboardForms() {
  const dashboards = useAppSelector(state => state.dashboard.dashboards)
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  return Object.values(dashboards).map(dashboard => (
    <DashboardForm dashboardId={dashboard.dashboard.id} isActive={activeDashboardId === dashboard.dashboard.id} />
  ))
}
