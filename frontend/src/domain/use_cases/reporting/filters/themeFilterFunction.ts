import type { ReportingDetailed } from '../../../entities/reporting'

export function themeFilterFunction(reporting: ReportingDetailed, themeFilter: number[] | undefined) {
  if (!themeFilter || themeFilter.length === 0) {
    return true
  }

  return !!reporting.themeId && themeFilter.includes(reporting.themeId)
}
