import type { ReportingDetailed } from '../../../entities/reporting'
import type { SourceFilterProps } from '../../../shared_slices/ReportingsFilters'

export function sourceFilterFunction(reporting: ReportingDetailed, sourceFilter: SourceFilterProps[] | undefined) {
  if (!sourceFilter || sourceFilter.length === 0) {
    return true
  }

  return (
    reporting.reportingSources.some(
      reportingSource =>
        !!reportingSource.controlUnitId && sourceFilter.map(source => source.id).includes(reportingSource.controlUnitId)
    ) ||
    reporting.reportingSources.some(
      reportingSource =>
        !!reportingSource.semaphoreId && sourceFilter.map(source => source.id).includes(reportingSource.semaphoreId)
    )
  )
}
