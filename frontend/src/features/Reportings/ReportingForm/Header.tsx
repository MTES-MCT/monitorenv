import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'

import { ReportingStatusEnum, getReportingStatus, type ReportingDetailed } from '../../../domain/entities/reporting'
import { ReportingContext } from '../../../domain/shared_slices/Global'
import { closeReporting } from '../../../domain/use_cases/reporting/closeReporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LinkToMissionTag } from '../components/LinkToMissionTag'
import {
  ReportingChevronIcon,
  ReportingHeader,
  ReportingHeaderButtons,
  ReportingInfosContainer,
  ReportingTitle,
  StyledArchivedTag
} from '../style'
import { getReportingTitle } from '../utils'

import type { AtLeast } from '../../../types'

export function Header({
  isExpanded,
  reduceOrCollapseReporting,
  reporting
}: {
  isExpanded: boolean
  reduceOrCollapseReporting: () => void
  reporting: AtLeast<ReportingDetailed, 'id'>
}) {
  const dispatch = useAppDispatch()

  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ||
    ReportingContext.MAP

  const statusTag = () => {
    const reportingStatus = getReportingStatus({
      createdAt: reporting?.createdAt,
      isArchived: reporting?.isArchived,
      reportType: reporting?.reportType,
      validityTime: reporting?.validityTime
    })
    if (reportingStatus === ReportingStatusEnum.ARCHIVED) {
      return <StyledArchivedTag accent={Accent.PRIMARY}>Archivé</StyledArchivedTag>
    }

    if (reporting?.missionId && !reporting?.detachedFromMissionAtUtc) {
      return <LinkToMissionTag />
    }

    return null
  }

  return (
    <ReportingHeader>
      <ReportingTitle data-cy="reporting-title">
        <ReportingInfosContainer>
          <Icon.Report />
          {getReportingTitle(reporting)}
        </ReportingInfosContainer>
        <div>{statusTag()}</div>
      </ReportingTitle>

      <ReportingHeaderButtons>
        <ReportingChevronIcon
          $isExpanded={isExpanded}
          accent={Accent.TERTIARY}
          data-id={`reporting-collapse-or-expand-button-${reporting?.id}`}
          Icon={Icon.Chevron}
          onClick={reduceOrCollapseReporting}
        />
        <IconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Close}
          onClick={() => dispatch(closeReporting(reporting.id, reportingContext))}
        />
      </ReportingHeaderButtons>
    </ReportingHeader>
  )
}
