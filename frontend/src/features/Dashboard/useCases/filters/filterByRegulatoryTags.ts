import { uniqBy } from 'lodash'

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

  const uniqueTags = uniqBy(filteredRegulatoryAreas.map(regulatoryArea => regulatoryArea?.tags).flat(), 'id')

  return uniqueTags.some(tag => tag && regulatoryTagsFilter.includes(tag.name))
}
