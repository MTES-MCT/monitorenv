import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { ThemeOption } from 'domain/entities/themes'

export function isVigilanceAreaPartOfTheme(
  vigilanceArea: VigilanceArea.VigilanceArea,
  themesFilter: ThemeOption[]
): boolean {
  if (!themesFilter || themesFilter.length === 0) {
    return true
  }

  const allThemes = vigilanceArea.themes
    ? [...vigilanceArea.themes, ...vigilanceArea.themes.flatMap(({ subThemes }) => subThemes)]
    : []

  return themesFilter.some(themeFilter => allThemes.some(theme => theme.id === themeFilter.id))
}
