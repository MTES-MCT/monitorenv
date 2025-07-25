import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { ThemeOption } from 'domain/entities/themes'

export function isVigilanceAreaPartOfTheme(
  vigilanceArea: VigilanceArea.VigilanceArea,
  themesFilter: ThemeOption[]
): boolean {
  if (!themesFilter || themesFilter.length === 0) {
    return true
  }

  const vigilanceAreaThemesWithoutChildren = vigilanceArea.themes
    ? [...vigilanceArea.themes.filter(tag => tag.subThemes?.length === 0)]
    : []
  const vigilanceAreaSubThemes = vigilanceArea.themes
    ? [...vigilanceArea.themes.flatMap(({ subThemes }) => subThemes)]
    : []

  const allThemesWithoutChildrenFilter = [...themesFilter.filter(tagFilter => tagFilter?.subThemes?.length === 0)]
  const allSubThemesFilter = themesFilter.flatMap(tagFilter => tagFilter?.subThemes || [])

  const hasMatchingSubThemes = allSubThemesFilter.some(tagFilter =>
    vigilanceAreaSubThemes.some(subTag => subTag.id === tagFilter.id)
  )

  let hasMatchingThemes = false
  if (vigilanceAreaThemesWithoutChildren.length > 0) {
    hasMatchingThemes = allThemesWithoutChildrenFilter.some(tagFilter =>
      vigilanceAreaThemesWithoutChildren.some(tag => tag.id === tagFilter.id)
    )
  }

  return hasMatchingThemes || hasMatchingSubThemes
}
