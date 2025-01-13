import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { DetachedReportingForTimeline } from '../../../../../../../domain/entities/reporting'

export function ReportingHistory({ action }: { action: DetachedReportingForTimeline }) {
  if (action.action === 'attach') {
    return (
      <>
        <Icon.Link color={THEME.color.charcoal} />
        <ReportingHistoryContainer>Signalement {action.reportingId} lié de la mission</ReportingHistoryContainer>
      </>
    )
  }

  return (
    <>
      <Icon.Unlink color={THEME.color.charcoal} />
      <ReportingHistoryContainer>Signalement {action.reportingId} détaché de la mission</ReportingHistoryContainer>
    </>
  )
}

const ReportingHistoryContainer = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  margin-left: 10px;
`
