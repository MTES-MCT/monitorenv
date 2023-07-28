import type { Reporting } from '../../../entities/reporting'

export function themeFilterFunction(reporting: Reporting, themeFilter: string[]) {
  if (themeFilter.length === 0) {
    return true
  }

  return !!reporting.theme && themeFilter.includes(reporting.theme)
}
