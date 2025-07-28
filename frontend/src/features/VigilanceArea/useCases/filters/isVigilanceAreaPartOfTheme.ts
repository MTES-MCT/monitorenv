import { isPartOfThemes } from '@utils/isPartOfThemes'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { ThemeOption } from 'domain/entities/themes'

export function isVigilanceAreaPartOfTheme(
  vigilanceArea: VigilanceArea.VigilanceArea,
  themesFilter: ThemeOption[]
): boolean {
  if (!themesFilter || themesFilter.length === 0) {
    return true
  }

  return isPartOfThemes({
    filterThemes: themesFilter,
    themesToCompare: vigilanceArea.themes || []
  })
}
