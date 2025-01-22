import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { uniq } from 'lodash'

export function RegulatoryAreasThemesCell({ themeIds }: { themeIds: number[] }) {
  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()

  if (!regulatoryAreas) {
    return null
  }
  if (!themeIds || themeIds.length === 0) {
    return '-'
  }

  const regulatoryAreasThemes = uniq(themeIds.map(themeId => regulatoryAreas.entities[themeId]?.thematique))
    .filter(Boolean)
    .join(', ')

  return <span title={regulatoryAreasThemes}>{regulatoryAreasThemes}</span>
}
