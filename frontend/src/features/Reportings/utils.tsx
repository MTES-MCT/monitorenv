import { Accent } from '@mtes-mct/monitor-ui'

import { StyledArchivedTag } from './style'
import {
  ReportingSourceEnum,
  type Reporting,
  getFormattedReportingId,
  ReportingStatusEnum,
  getReportingStatus
} from '../../domain/entities/reporting'

export function getReportingInitialValues(reporting?: Partial<Reporting | undefined>) {
  return {
    createdAt: new Date().toISOString(),
    geom: undefined,
    sourceType: ReportingSourceEnum.SEMAPHORE,
    validityTime: 24,
    ...reporting
  }
}

export function isNewReporting(id: string | number) {
  return id?.toString().includes('new') ?? false
}

export const getReportingTitle = reporting => {
  const { id, reportingId } = reporting
  const reportingStatus = getReportingStatus(reporting)
  if (isNewReporting(id)) {
    return `NOUVEAU SIGNALEMENT (${String(id).slice(4)})`
  }

  return (
    <>
      {`SIGNALEMENT ${getFormattedReportingId(reportingId)}`}
      {reportingStatus === ReportingStatusEnum.ARCHIVED && (
        <StyledArchivedTag accent={Accent.PRIMARY}>Archivé</StyledArchivedTag>
      )}
    </>
  )
}
