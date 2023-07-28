import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingStatusEnum } from '../domain/entities/reporting'

export function ReportingStatusLabel({ reportingStatus }: { reportingStatus: ReportingStatusEnum }) {
  switch (reportingStatus) {
    case ReportingStatusEnum.ARCHIVED:
      return (
        <StatusWrapper color={THEME.color.slateGray}>
          <StyledCircle color={THEME.color.slateGray} />
          Archivé
        </StatusWrapper>
      )
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return (
        <StatusWrapper color={THEME.color.maximumRed}>
          <StyledCircle color={THEME.color.maximumRed} />
          En cours
        </StatusWrapper>
      )
    case ReportingStatusEnum.OBSERVATION:
    case ReportingStatusEnum.IN_PROGRESS:
    default:
      return (
        <StatusWrapper color={THEME.color.blueGray[100]}>
          <StyledCircle color={THEME.color.blueGray[100]} />
          En cours
        </StatusWrapper>
      )
  }
}

const StatusWrapper = styled.div<{ color: string; smallMargin?: boolean }>`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  svg {
    margin-right: ${p => (p.smallMargin ? '2px' : '6px')};
    margin-left: ${p => (p.smallMargin ? '-2px' : '0px')};
  }
`
const StyledCircle = styled.div<{ color: string }>`
  height: 10px;
  width: 10px;
  margin-right: 6px;
  background-color: ${p => p.color};
  border-radius: 50%;
  display: inline-block;
`
