import type { Reporting } from 'domain/entities/reporting'
import type { ThemeOption } from 'domain/entities/themes'

export function isReportingPartOfTheme(reporting: Reporting, themesFilter: ThemeOption[] | undefined) {
  if (!themesFilter || themesFilter.length === 0) {
    return true
  }

  const allThemes = [reporting.theme, ...reporting.theme.subThemes]

  return themesFilter.some(themeFilter => allThemes.some(theme => theme.id === themeFilter.id))
}
