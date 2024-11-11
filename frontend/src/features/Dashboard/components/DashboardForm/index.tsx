import { getActiveDashboardId, getDashboards } from '@features/Dashboard/slice'
import { useAppSelector } from '@hooks/useAppSelector'

import { DashboardForm } from './DashboardForm'

export function DashboardForms() {
  const dashboards = useAppSelector(state => getDashboards(state.dashboard))
  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))

  return Object.entries(dashboards).map(([key, dashboard]) => (
    <DashboardForm key={key} dashboardForm={[key, dashboard]} isActive={activeDashboardId === key} />
  ))
}
