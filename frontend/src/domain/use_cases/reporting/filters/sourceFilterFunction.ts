import type { Reporting } from '../../../entities/reporting'
import type { SourceFilterProps } from '../../../shared_slices/ReportingsFilters'

export function sourceFilterFunction(reporting: Reporting, sourceFilter: SourceFilterProps[] | undefined) {
  if (!sourceFilter || sourceFilter.length === 0) {
    return true
  }

  return (
    (!!reporting.controlUnitId && sourceFilter.some(source => source.id === reporting.controlUnitId)) ||
    (!!reporting.semaphoreId && sourceFilter.some(source => source.id === reporting.semaphoreId))
  )
}
