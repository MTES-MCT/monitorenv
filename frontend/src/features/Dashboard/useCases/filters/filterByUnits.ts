import type { Dashboard } from '@features/Dashboard/types'

export function filterByUnits(controlUnits: number[], dashboard: Dashboard.DashboardFromApi): boolean {
  return controlUnits.length === 0 || dashboard.controlUnitIds.some(control => controlUnits.includes(control))
}
