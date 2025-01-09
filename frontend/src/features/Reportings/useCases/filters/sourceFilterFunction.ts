import type { SourceFilterProps } from '@features/Reportings/Filters/slice'
import type { Reporting } from 'domain/entities/reporting'

export function sourceFilterFunction(reporting: Reporting, sourceFilter: SourceFilterProps[] | undefined) {
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
