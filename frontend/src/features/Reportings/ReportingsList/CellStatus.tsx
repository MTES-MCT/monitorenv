import { getReportingStatus } from '../../../domain/entities/reporting'
import { ReportingStatusLabel } from '../../../ui/ReportingStatusLabel'

export function CellStatus({ row }: { row: any }) {
  const status = getReportingStatus(row.original)

  return <ReportingStatusLabel reportingStatus={status} />
}
