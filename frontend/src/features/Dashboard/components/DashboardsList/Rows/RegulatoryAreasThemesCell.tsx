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

  const uniqueThemes = uniq(
    themeIds.flatMap(themeId => regulatoryAreas.entities[themeId]?.tags.map(theme => theme.name))
  )

  const regulatoryAreasThemes = uniqueThemes.filter(Boolean).join(', ')

  return <span title={regulatoryAreasThemes}>{regulatoryAreasThemes}</span>
}
