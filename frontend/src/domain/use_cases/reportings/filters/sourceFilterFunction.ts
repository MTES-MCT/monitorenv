import type { ReportingDetailed } from '../../../entities/reporting'
import type { SourceFilterProps } from '../../../shared_slices/ReportingsFilters'

export function sourceFilterFunction(reporting: ReportingDetailed, sourceFilter: SourceFilterProps[]) {
  if (sourceFilter.length === 0) {
    return true
  }

  return (
    (!!reporting.controlUnitId && sourceFilter.some(source => source.id === reporting.controlUnitId)) ||
    (!!reporting.semaphoreId && sourceFilter.some(source => source.id === reporting.semaphoreId))
  )
}
