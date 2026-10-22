import type { Dashboard } from '@features/Dashboard/types'

export function filterByThemes(themesFilter: number[], dashboard: Dashboard.DashboardFromApi): boolean {
  if (themesFilter.length === 0) {
    return true
  }

  return !!dashboard.themes?.some(theme => theme && themesFilter.includes(theme.id))
}
