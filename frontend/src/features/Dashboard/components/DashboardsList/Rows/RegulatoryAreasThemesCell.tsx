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
    themeIds.map(themeId => regulatoryAreas.entities[themeId]?.thematique.split(', ')).flatMap(theme => theme)
  )

  const regulatoryAreasThemes = uniqueThemes.filter(Boolean).join(', ')

  return <span title={regulatoryAreasThemes}>{regulatoryAreasThemes}</span>
}
