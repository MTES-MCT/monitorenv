import type { Reporting } from 'domain/entities/reporting'
import type { ThemeOption } from 'domain/entities/themes'

export function isReportingPartOfTheme(reporting: Reporting, themesFilter: ThemeOption[] | undefined) {
  if (!themesFilter || themesFilter.length === 0) {
    return true
  }

  const isReportingThemeIsWithoutChildren = reporting.theme.subThemes.length === 0
  const allReportingSubThemes = [...reporting.theme.subThemes]

  const allThemesWithoutChildrenFilter = [...themesFilter.filter(themeFilter => themeFilter?.subThemes?.length === 0)]
  const allSubThemesFilter = themesFilter.flatMap(themeFilter => themeFilter?.subThemes || [])

  let hasMatchingThemes = false
  if (isReportingThemeIsWithoutChildren) {
    hasMatchingThemes = allThemesWithoutChildrenFilter.some(themeFilter => reporting.theme.id === themeFilter.id)
  }

  const hasMatchingSubThemes = allSubThemesFilter?.some(subThemeFilter =>
    allReportingSubThemes.some(subTheme => subTheme.id === subThemeFilter.id)
  )

  return hasMatchingThemes || hasMatchingSubThemes
}
