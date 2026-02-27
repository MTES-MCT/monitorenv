import { uniq } from 'lodash'

import type { Dashboard } from '@features/Dashboard/types'
import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function filterByRegulatoryTags(
  regulatoryTagsFilter: string[],
  dashboard: Dashboard.DashboardFromApi,
  regulatoryAreas: RegulatoryArea.RegulatoryAreasGroup[]
): boolean {
  if (regulatoryTagsFilter.length === 0) {
    return true
  }

  const filteredRegulatoryAreas = regulatoryAreas
    .flatMap(group => group.regulatoryAreas)
    .filter(regulatoryArea => dashboard.regulatoryAreaIds?.includes(regulatoryArea.id))

  const uniqueTags = uniq(filteredRegulatoryAreas.map(regulatoryArea => regulatoryArea?.tags).flatMap(theme => theme))

  return uniqueTags.some(tag => tag && regulatoryTagsFilter.includes(tag.name))
}
