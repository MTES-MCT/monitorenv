import { Accent } from '@mtes-mct/monitor-ui'
import _ from 'lodash'

import { LinkToMissionTag } from './components/LinkToMissionTag'
import { StyledArchivedTag } from './style'
import {
  ReportingSourceEnum,
  type Reporting,
  getFormattedReportingId,
  ReportingStatusEnum,
  getReportingStatus
} from '../../domain/entities/reporting'

import type { AtLeast } from '../../types'

export function getReportingInitialValues(reporting: AtLeast<Reporting, 'id'> | Reporting): AtLeast<Reporting, 'id'> {
  return {
    geom: undefined,
    sourceType: ReportingSourceEnum.SEMAPHORE,
    validityTime: 24,
    ...reporting
  }
}

export function isNewReporting(id: string | number | undefined) {
  if (!id) {
    return false
  }

  return id?.toString().includes('new') ?? false
}

export const getReportingTitle = reporting => {
  if (!reporting) {
    return undefined
  }
  const { id, reportingId } = reporting || {}
  const reportingStatus = getReportingStatus(reporting)
  if (isNewReporting(id)) {
    return `NOUVEAU SIGNALEMENT (${String(id).slice(4)})`
  }

  const statusTag = () => {
    if (reportingStatus === ReportingStatusEnum.ARCHIVED) {
      return <StyledArchivedTag accent={Accent.PRIMARY}>Archivé</StyledArchivedTag>
    }

    if (reporting.attachedMissionId) {
      return <LinkToMissionTag />
    }

    return null
  }

  return (
    <>
      {`SIGNALEMENT ${getFormattedReportingId(reportingId)}`}
      {statusTag()}
    </>
  )
}

export const createIdForNewReporting = reportings => {
  const maxNewReportingId = _.chain(reportings)
    .filter(newReporting => isNewReporting(newReporting.reporting.id))
    .maxBy(filteredNewReporting => Number(filteredNewReporting?.reporting?.id?.split('new-')[1]))
    .value()

  const id =
    maxNewReportingId && maxNewReportingId.reporting.id
      ? `new-${Number(maxNewReportingId?.reporting?.id?.split('new-')[1]) + 1}`
      : 'new-1'

  return id
}
