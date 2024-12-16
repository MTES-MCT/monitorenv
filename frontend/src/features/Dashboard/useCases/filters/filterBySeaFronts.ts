import type { Dashboard } from '@features/Dashboard/types'

export function filterBySeaFronts(seaFronts: string[], dashboard: Dashboard.DashboardFromApi): boolean {
  return seaFronts.length === 0 || !!(dashboard.seaFront && seaFronts.includes(dashboard.seaFront))
}
