import type { Reporting } from '../../../entities/reporting'

export function unitFilterFunction(reporting: Reporting, filter: string[]) {
  if (filter.length === 0) {
    return true
  }

  return !!reporting.controlUnitId && filter.includes(String(reporting.controlUnitId))
}
