import { filterSubThemes } from './getThemesAsOptions'

import type { ThemeOption } from 'domain/entities/themes'

export function deleteThemeTag(filter: ThemeOption[], valueToDelete: ThemeOption) {
  let updatedFilter: ThemeOption[] = [...filter]

  if (valueToDelete.subThemes && valueToDelete.subThemes.length > 0) {
    updatedFilter = filter.filter(theme => theme.id !== valueToDelete.id)
  } else {
    updatedFilter = filter
      .map(theme => filterSubThemes(theme, valueToDelete))
      .filter(theme => theme !== undefined)
      .filter(theme => theme.id !== valueToDelete.id)
  }

  return updatedFilter
}
