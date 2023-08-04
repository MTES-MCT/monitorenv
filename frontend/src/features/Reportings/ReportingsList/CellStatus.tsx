import { getReportingStatus } from '../../../domain/entities/reporting'
import { ReportingStatusTag } from '../../../ui/ReportingStatusTag'

export function CellStatus({ row }: { row: any }) {
  const status = getReportingStatus(row.original)

  return <ReportingStatusTag reportingStatus={status} />
}
