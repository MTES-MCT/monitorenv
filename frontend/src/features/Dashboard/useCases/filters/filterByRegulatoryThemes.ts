import type { Dashboard } from '@features/Dashboard/types'
import type { RegulatoryLayerWithMetadata } from 'domain/entities/regulatory'

export function filterByRegulatoryThemes(
  regulatoryThemes: string[],
  dashboard: Dashboard.DashboardFromApi,
  regulatoryAreas: RegulatoryLayerWithMetadata[]
): boolean {
  if (regulatoryThemes.length === 0) {
    return true
  }

  const filteredRegulatoryAreas = regulatoryAreas.filter(regulatoryArea =>
    dashboard.regulatoryAreaIds?.includes(regulatoryArea.id)
  )

  return filteredRegulatoryAreas.some(reg => regulatoryThemes.includes(reg.layer_name))
}
