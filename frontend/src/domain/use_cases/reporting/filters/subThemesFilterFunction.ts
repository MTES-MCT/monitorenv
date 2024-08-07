import type { Reporting } from 'domain/entities/reporting'

export function subThemesFilterFunction(reporting: Reporting, subThemesFilter: number[] | undefined) {
  if (!subThemesFilter || subThemesFilter.length === 0) {
    return true
  }

  return !!reporting?.subThemeIds?.find(subThemeId => {
    if (subThemesFilter.find(subThemeFilter => subThemeFilter === subThemeId)) {
      return subThemeId
    }

    return false
  })
}
