import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { getTitle } from 'domain/entities/layers/utils'

export function RegulatoryAreasThemesCell({ themeIds }: { themeIds: number[] }) {
  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()

  if (!regulatoryAreas) {
    return null
  }
  if (!themeIds || themeIds.length === 0) {
    return '-'
  }

  const regulatoryAreasThemes = themeIds
    .map(themeId => getTitle(regulatoryAreas.entities[themeId]?.layer_name))
    .join(', ')

  return <span title={regulatoryAreasThemes}>{regulatoryAreasThemes}</span>
}
