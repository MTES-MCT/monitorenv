import type { Dashboard } from '@features/Dashboard/types'

export function filterByTags(tagsFilter: number[], dashboard: Dashboard.DashboardFromApi): boolean {
  if (tagsFilter.length === 0) {
    return true
  }

  return !!dashboard.tags?.some(tag => tag && tagsFilter.includes(tag.id))
}
