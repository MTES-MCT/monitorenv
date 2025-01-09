import type { Reporting } from 'domain/entities/reporting'

export function themeFilterFunction(reporting: Reporting, themeFilter: number[] | undefined) {
  if (!themeFilter || themeFilter.length === 0) {
    return true
  }

  return !!reporting.themeId && themeFilter.includes(reporting.themeId)
}
