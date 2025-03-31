import { uniq } from 'lodash'

import type { Dashboard } from '@features/Dashboard/types'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function filterByRegulatoryTags(
  regulatoryTagsFilter: string[],
  dashboard: Dashboard.DashboardFromApi,
  regulatoryAreas: RegulatoryLayerWithMetadata[]
): boolean {
  if (regulatoryTagsFilter.length === 0) {
    return true
  }

  const filteredRegulatoryAreas = regulatoryAreas.filter(regulatoryArea =>
    dashboard.regulatoryAreaIds?.includes(regulatoryArea.id)
  )
  const uniqueThemes = uniq(filteredRegulatoryAreas.map(regulatoryArea => regulatoryArea?.tags).flatMap(theme => theme))

  return uniqueThemes.some(({ name }) => regulatoryTagsFilter.includes(name))
}
