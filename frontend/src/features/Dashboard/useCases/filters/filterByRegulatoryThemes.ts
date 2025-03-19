import { uniq } from 'lodash'

import type { Dashboard } from '@features/Dashboard/types'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function filterByRegulatoryThemes(
  regulatoryThemesFilter: string[],
  dashboard: Dashboard.DashboardFromApi,
  regulatoryAreas: RegulatoryLayerWithMetadata[]
): boolean {
  if (regulatoryThemesFilter.length === 0) {
    return true
  }

  const filteredRegulatoryAreas = regulatoryAreas.filter(regulatoryArea =>
    dashboard.regulatoryAreaIds?.includes(regulatoryArea.id)
  )
  const uniqueThemes = uniq(
    filteredRegulatoryAreas.map(regulatoryArea => regulatoryArea?.themes).flatMap(theme => theme)
  )

  return uniqueThemes.some(({ name }) => regulatoryThemesFilter.includes(name))
}
