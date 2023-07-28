import { reportingTypeLabels } from '../../../domain/entities/reporting'

export function getReportType(reportType: string) {
  return (reportType && reportingTypeLabels[reportType]?.label) || ''
}
