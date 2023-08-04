import type { ReportingDetailed } from '../../../entities/reporting'

export function themeFilterFunction(reporting: ReportingDetailed, themeFilter: string[]) {
  if (themeFilter.length === 0) {
    return true
  }

  return !!reporting.theme && themeFilter.includes(reporting.theme)
}
