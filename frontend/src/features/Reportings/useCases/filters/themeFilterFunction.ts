import type { Reporting } from 'domain/entities/reporting'
import type { ThemeAPI } from 'domain/entities/themes'

export function themeFilterFunction(reporting: Reporting, themeFilter: ThemeAPI[] | undefined) {
  if (!themeFilter || themeFilter.length === 0) {
    return true
  }

  return (
    !!reporting.theme &&
    themeFilter.some(theme =>
      theme.subThemes.some(subThemeFilter =>
        reporting.theme.subThemes.some(subTheme => subTheme.id === subThemeFilter.id)
      )
    )
  )
}
