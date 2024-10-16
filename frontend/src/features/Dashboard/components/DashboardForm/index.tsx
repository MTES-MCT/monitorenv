import { useAppSelector } from '@hooks/useAppSelector'

import { DashboardForm } from './DashboardForm'

export function DashboardForms() {
  const dashboards = useAppSelector(state => state.dashboard.dashboards)
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  return Object.entries(dashboards).map(([key, dashboard]) => (
    <DashboardForm key={key} dashboardForm={[key, dashboard]} isActive={activeDashboardId === key} />
  ))
}
