import { ReportingStatusTag } from '../../../ui/ReportingStatusTag'
import { getReportingStatus } from '../utils'

export function CellStatus({ row }: { row: any }) {
  const status = getReportingStatus(row.original)

  return <ReportingStatusTag reportingStatus={status} />
}
