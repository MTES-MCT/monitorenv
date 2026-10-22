import { ControlUnit } from '@mtes-mct/monitor-ui'

import type { Dashboard } from '@features/Dashboard/types'

export function filterByAdmins(
  administrations: number[],
  dashboard: Dashboard.DashboardFromApi,
  allControlUnits: ControlUnit.ControlUnit[] | undefined
): boolean {
  const allAdminIdsByControlUnit = allControlUnits
    ?.filter(controlUnit => dashboard.controlUnitIds.includes(controlUnit.id))
    .map(controlUnit => controlUnit.administration.id)

  return administrations.length === 0 || !!allAdminIdsByControlUnit?.some(adminId => administrations.includes(adminId))
}
