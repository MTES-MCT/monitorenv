import type { ReportingDetailed } from '../../../entities/reporting'

export function unitFilterFunction(reporting: ReportingDetailed, filter: string[]) {
  if (filter.length === 0) {
    return true
  }

  return !!reporting.controlUnitId && filter.includes(String(reporting.controlUnitId))
}
